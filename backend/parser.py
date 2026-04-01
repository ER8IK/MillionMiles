import asyncio
import json
import re
from datetime import datetime, timezone
from pathlib import Path

from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError

OUTPUT_FILE = Path(__file__).parent / "cars.json"
TARGET_COUNT = 30

# Прямой API запрос — надёжнее чем DOM
API_URL = (
    "https://api.encar.com/search/car/list/general"
    "?count=true"
    "&q=(And.Hidden.N._.CarType.Y.)"
    "&sr=%7CModifiedDate%7C0%7C{limit}"
    "&fields=Manufacturer,Model,Badge,FormYear,Mileage,Price,Photo,Id"
)


async def fetch_via_api(page) -> list[dict]:
    """Получаем данные через публичный JSON API Encar."""
    url = API_URL.format(limit=TARGET_COUNT)
    print(f"[api] Fetching: {url}")

    result = await page.evaluate(f"""
        async () => {{
            try {{
                const r = await fetch("{url}", {{
                    headers: {{
                        "Accept": "application/json",
                        "Referer": "https://www.encar.com/"
                    }}
                }});
                if (!r.ok) return {{ error: r.status }};
                return await r.json();
            }} catch(e) {{
                return {{ error: e.toString() }};
            }}
        }}
    """)

    if not result or result.get("error"):
        print(f"[api] Error: {result}")
        return []

    raw_list = result.get("SearchResults") or result.get("Cars") or []
    print(f"[api] Got {len(raw_list)} results")

    cars = []
    for item in raw_list:
        try:
            car = parse_api_item(item)
            if car:
                cars.append(car)
                print(f"  [{len(cars):02d}] {car['brand']} {car['model']} | {car['year']} | {car['mileage']} | {car['price']}")
        except Exception as e:
            print(f"  [skip] {e}")

    return cars


def parse_api_item(item: dict) -> dict | None:
    brand = (item.get("Manufacturer") or item.get("MakerName") or "").strip()
    model = (item.get("Model") or item.get("ModelName") or "").strip()
    badge = (item.get("Badge") or item.get("BadgeName") or "").strip()
    full_model = f"{model} {badge}".strip()

    # Год: FormYear обычно 6 цифр — 202303 = март 2023
    form_year = str(item.get("FormYear") or item.get("Year") or "")
    year = form_year[:4] if len(form_year) >= 4 else "N/A"

    # Пробег
    mileage_raw = item.get("Mileage") or 0
    mileage = f"{int(mileage_raw):,}km" if mileage_raw else "N/A"

    # Цена (в единицах 만원)
    price_raw = item.get("Price") or 0
    price = f"{int(price_raw):,}만원" if price_raw else "N/A"

    # Фото
    car_id = str(item.get("Id") or item.get("CarNo") or "")
    photo = item.get("Photo") or item.get("ThumbImage") or ""
    if photo and not photo.startswith("http"):
        photo = "https://ci.encar.com" + photo
    if not photo and car_id:
        photo = f"https://ci.encar.com/carpicture/carpicture01/pic{car_id[:4]}/{car_id}_001.jpg"

    detail_url = f"https://www.encar.com/dc/dc_cardetailview.do?carid={car_id}" if car_id else ""

    if not brand and not model:
        return None

    return {
        "brand": brand,
        "model": full_model,
        "year": year,
        "mileage": mileage,
        "price": price,
        "image": photo,
        "detail_url": detail_url,
        "scraped_at": datetime.now(timezone.utc).isoformat(),
    }


async def parse_cars() -> list[dict]:
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=[
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--single-process",
            ],
        )
        context = await browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            ),
            viewport={"width": 1280, "height": 900},
        )
        page = await context.new_page()

        # Сначала открываем сайт чтобы получить cookies/referer
        print("[parser] Opening Encar homepage...")
        try:
            await page.goto(
                "https://www.encar.com",
                wait_until="domcontentloaded",
                timeout=30_000,
            )
        except PlaywrightTimeoutError:
            print("[parser] Homepage timeout, continuing...")

        await page.wait_for_timeout(2_000)

        # Пробуем API
        cars = await fetch_via_api(page)

        # Если API не дал результатов — fallback на DOM парсинг
        if not cars:
            print("[parser] API returned nothing, trying DOM fallback...")
            cars = await parse_dom_fallback(page)

        await browser.close()
    return cars


async def parse_dom_fallback(page) -> list[dict]:
    """Запасной вариант — парсим HTML напрямую."""
    print("[dom] Navigating to listing page...")
    try:
        await page.goto(
            "https://www.encar.com/dc/dc_carsearchlist.do?carType=kor",
            wait_until="networkidle",
            timeout=40_000,
        )
    except PlaywrightTimeoutError:
        pass

    await page.wait_for_timeout(3_000)

    # Пробуем разные возможные селекторы
    selectors = ["tr.list", "ul.car_list li", ".car_list li", "li.item"]
    items = []
    for sel in selectors:
        items = await page.query_selector_all(sel)
        if items:
            print(f"[dom] Found {len(items)} items with selector: {sel}")
            break

    if not items:
        # Дампим часть HTML для диагностики
        body = await page.inner_text("body")
        print(f"[dom] No items found. Page text preview:\n{body[:500]}")
        return []

    cars = []
    for item in items[:TARGET_COUNT]:
        try:
            car = await extract_from_row(item)
            if car:
                cars.append(car)
                print(f"  [{len(cars):02d}] {car['brand']} {car['model']} | {car['year']} | {car['price']}")
        except Exception as e:
            print(f"  [skip] {e}")

    return cars


async def extract_from_row(el) -> dict | None:
    """Извлекаем данные из строки/элемента списка."""
    # Получаем весь текст ячеек
    cells = await el.query_selector_all("td, li")
    texts = []
    for c in cells:
        t = (await c.inner_text()).strip()
        if t and t not in texts:
            texts.append(t)

    if not texts:
        return None

    # Ищем год
    year = "N/A"
    for t in texts:
        m = re.search(r"(20\d{2}|19\d{2})", t)
        if m:
            year = m.group(1)
            break

    # Ищем пробег
    mileage = "N/A"
    for t in texts:
        m = re.search(r"([\d,]+\s*km)", t, re.IGNORECASE)
        if m:
            mileage = m.group(1).strip()
            break

    # Ищем цену
    price = "N/A"
    for t in texts:
        m = re.search(r"([\d,]+\s*만원)", t)
        if m:
            price = m.group(1).strip()
            break

    # Изображение
    img_el = await el.query_selector("img")
    image_url = ""
    if img_el:
        src = (await img_el.get_attribute("data-src") or
               await img_el.get_attribute("src") or "")
        if src.startswith("//"):
            src = "https:" + src
        image_url = src

    # Ссылка
    a_el = await el.query_selector("a[href*='carid']")
    detail_url = ""
    if a_el:
        href = await a_el.get_attribute("href") or ""
        detail_url = ("https://www.encar.com" + href
                      if href.startswith("/") else href)

    return {
        "brand": texts[0] if texts else "",
        "model": texts[1] if len(texts) > 1 else "",
        "year": year,
        "mileage": mileage,
        "price": price,
        "image": image_url,
        "detail_url": detail_url,
        "scraped_at": datetime.now(timezone.utc).isoformat(),
    }


def save(cars: list[dict]) -> None:
    payload = {
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "count": len(cars),
        "cars": cars,
    }
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    print(f"\nSaved {len(cars)} cars → {OUTPUT_FILE}")


async def main() -> None:
    print(f"=== Encar parser start {datetime.now(timezone.utc).isoformat()} ===")
    cars = await parse_cars()
    if not cars:
        print("WARNING: 0 cars collected.")
    save(cars)
    print("=== Done ===")


if __name__ == "__main__":
    asyncio.run(main())