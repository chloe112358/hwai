import base64

def image_to_base64(image_path, output_path):
    with open(image_path, "rb") as img_file:
        b64_string = base64.b64encode(img_file.read()).decode("utf-8")
    with open(output_path, "w") as b64_file:
        b64_file.write(b64_string)
    print("Done")

image_to_base64("assets/beaver.png", "beaver.b64")
