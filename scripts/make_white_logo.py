from PIL import Image, ImageOps
import sys

def make_white_version(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    new_data = []
    for item in datas:
        # If not fully transparent, make it white
        if item[3] > 0:
            new_data.append((255, 255, 255, item[3]))
        else:
            new_data.append(item)

    img.putdata(new_data)
    img.save(output_path)

if __name__ == "__main__":
    make_white_version(sys.argv[1], sys.argv[2])
