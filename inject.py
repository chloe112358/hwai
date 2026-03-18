import base64
import re

PNG_PATH = "assets/beaver.png"
B64_PATH = "beaver.b64"
HTML_PATH = "submission.html"


def build_base64_from_png(png_path: str) -> str:
    with open(png_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


def write_b64_file(b64_path: str, b64_string: str) -> None:
    with open(b64_path, "w", encoding="utf-8") as b64_file:
        b64_file.write(b64_string)


def inject_into_submission(html_path: str, b64_string: str) -> None:
    with open(html_path, "r", encoding="utf-8") as f:
        html_content = f.read()

    data_uri = f"data:image/png;base64,{b64_string}"
    replacement = f'const BEAVER_SRC = "{data_uri}";'

    new_html, count = re.subn(
        r'const\s+BEAVER_SRC\s*=\s*"data:image/png;base64,[^"]*";',
        replacement,
        html_content,
        count=1,
    )

    if count != 1:
        raise RuntimeError("Cannot find BEAVER_SRC in submission.html for replacement.")

    with open(html_path, "w", encoding="utf-8") as f:
        f.write(new_html)


if __name__ == "__main__":
    encoded = build_base64_from_png(PNG_PATH)
    write_b64_file(B64_PATH, encoded)
    inject_into_submission(HTML_PATH, encoded)
    print("Updated beaver.b64 and BEAVER_SRC in submission.html")
