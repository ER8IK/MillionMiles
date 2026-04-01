import asyncio
import json
import re
from datetime import datetime, timezone
from pathlib import Path

from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError

OUTPUT_FILE = Path(__file__).parent / "cars.json"
TARGET_COUNT = 30

ENCAR_URL = (
    "https://www.encar.com/dc/dc_carsearchlist.do?carType=kor"
    "#!%7B%22action%22%3A%22(And.Hidden.N._.CarType.Y.)%22"
    "%2C%22toggle%22%3A%7B%7D%2C%22layer%22%3A%22%22"
    "%2C%22sort%22%3A%22ModifiedDate%22%2C%22page%22%3A1%2C%22limit%22%3A20%7D"
)


def parse_year(text: str) -> str:
    m = re.search(r"(\d{2,4})년", text)
    if m:
        y = int(m.group(1))
        if y < 100:
            y = 2000 + y if y <= 50 else 1900 + y
        return str(y)
    m4 = re.search(r"(20\d{2}|19\d{2})", text)
    return m4.group(1) if m4 else text.strip()


async def get_text(el, selector: str) -> str:
    node = await el.query_selector(selector)
    if not node:
        return ""
    return (await node.inner_text()).strip()


async def extract_car(li) -> dict | None:
    title_raw = await get_text(li, ".list_ttl, strong.list_ttl")
    if not title_raw:
        title_raw = await get_text(li, "strong")

    parts = title_raw.split() if title_raw else []
    brand = parts[0] if parts else ""
    model = " ".join(parts[1:3]) if len(parts) > 1 else ""

    info_els = await li.query_selector_all(".list_info li, ul.list_info li")
    info_texts = [((await el.inner_text()).strip()) for el in info_els]

    year = ""
    mileage = ""
    for t in info_texts:
        if "년" in t and not year:
            year = parse_year(t)
        elif "km" in t.lower() and not mileage:
            mileage = t

    price = await get_text(li, ".price_wrap, .price, [class*='price']")
    if not price:
        price_el = await li.query_selector("em, strong, span")
        if price_el:
            candidate = (await price_el.inner_text()).strip()
            if "만원" in candidate or "만" in candidate:
                price = candidate

    img_el = await li.query_selector("img")
    image_url = ""
    if img_el:
        src = await img_el.get_attribute("src") or ""
        data_src = await img_el.get_attribute("data-src") or ""
        raw = data_src or src
        if raw.startswith("//"):
            raw = "https:" + raw
        image_url = raw

    a_el = await li.query_selector("a[href]")
    detail_url = ""
    if a_el:
        href = await a_el.get_attribute("href") or ""
        if href.startswith("/"):
            detail_url = "https://www.encar.com" + href
        elif href.startswith("http"):
            detail_url = href

    if not brand and not title_raw:
        return None

    return {
        "brand": brand,
        "model": model,
        "year": year or "N/A",
        "mileage": mileage or "N/A",
        "price": price or "N/A",
        "image": image_url,
        "detail_url": detail_url,
        "scraped_at": datetime.now(timezone.utc).isoformat(),
    }


async def parse_cars() -> list[dict]:
    cars: list[dict] = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-dev-shm-usage"],
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

        print("Navigating...")
        try:
            await page.goto(ENCAR_URL, wait_until="domcontentloaded", timeout=30_000)
        except PlaywrightTimeoutError:
            print("  [warn] Initial load timed out, continuing...")

        try:
            await page.wait_for_selector("ul.car_list li", timeout=20_000)
        except PlaywrightTimeoutError:
            print("  [warn] ul.car_list not found within timeout")

        await page.wait_for_timeout(2_000)

        page_num = 1

        while len(cars) < TARGET_COUNT:
            items = await page.query_selector_all("ul.car_list li")
            print(f"Page {page_num}: {len(items)} items found")

            for li in items:
                if len(cars) >= TARGET_COUNT:
                    break
                try:
                    car = await extract_car(li)
                    if car:
                        cars.append(car)
                        print(f"  [{len(cars):02d}] {car['brand']} {car['model']} "
                              f"| {car['year']} | {car['mileage']} | {car['price']}")
                except Exception as exc:
                    print(f"  [skip] {exc}")

            if len(cars) >= TARGET_COUNT:
                break

            next_sel = "a.next, button.next, .paginate a.next, [class*='next']"
            next_btn = await page.query_selector(next_sel)
            if not next_btn:
                print("No next-page button found — stopping.")
                break
            try:
                await next_btn.click()
                await page.wait_for_selector("ul.car_list li", timeout=10_000)
                await page.wait_for_timeout(1_500)
                page_num += 1
            except Exception as exc:
                print(f"Pagination failed: {exc}")
                break

        await browser.close()

    return cars


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
    print(f"=== Encar parser start  {datetime.now(timezone.utc).isoformat()} ===")
    cars = await parse_cars()
    if not cars:
        print("WARNING: 0 cars collected. DOM may have changed — re-run the debug block.")
    save(cars)
    print("=== Done ===")


if __name__ == "__main__":
    asyncio.run(main())
