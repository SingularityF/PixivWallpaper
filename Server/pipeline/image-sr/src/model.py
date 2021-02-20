import time
import json
import uuid
import tensorflow_hub as hub
import tensorflow as tf
import numpy as np
from PIL import Image
from error_handlers import exception_handler


def get_enhanced_path():
    save_path = f"./imgs/{uuid.uuid4()}.jpg"
    return save_path


def preprocess_image(contents):
    """ Loads image from path and preprocesses to make it model ready
        Args:
          image_path: Path to the image file
    """
    hr_image = tf.image.decode_image(contents)
    # If PNG, remove the alpha channel. The model only supports
    # images with 3 color channels.
    if hr_image.shape[-1] == 4:
        hr_image = hr_image[..., :-1]
    hr_size = (tf.convert_to_tensor(hr_image.shape[:-1]) // 4) * 4
    hr_image = tf.image.crop_to_bounding_box(
        hr_image, 0, 0, hr_size[0], hr_size[1])
    hr_image = tf.cast(hr_image, tf.float32)
    return tf.expand_dims(hr_image, 0)


def save_image(image, filename):
    """
      Saves unscaled Tensor Images.
      Args:
        image: 3D image tensor. [height, width, channels]
        filename: Name of the file to save to.
    """
    if not isinstance(image, Image.Image):
        image = tf.clip_by_value(image, 0, 255)
        image = Image.fromarray(tf.cast(image, tf.uint8).numpy())
    image.save(filename)
    print("Saved as %s" % filename)


if __name__ == "__main__":
    start_time = time.time()
    print("Starting image super-resolution")

    try:
        model = hub.load("https://tfhub.dev/captain-pool/esrgan-tf2/1")
        print("Model downloaded")
    except:
        exception_handler("Model download failed")

    try:
        with open("data.json", "r") as f:
            list_data = json.load(f)
        print("JSON file parsed")
    except:
        exception_handler("Read JSON failed")

    if(len(list_data) == 0):
        print("No image to process, exiting...")
        exit(0)

    try:
        list_new_data = []
        img_batch = []
        for data in list_data:
            saved_file = data["saved_file"]
            with open(saved_file, "br") as f:
                img_mat = preprocess_image(f.read())
                img_batch.append(img_mat)
        print("Images loaded")
    except:
        exception_handler("Image load failed")

    try:
        processed_batch = []
        for img in img_batch:
            processed_batch.append(model(img))
        print("Super-resolution successful")
    except:
        exception_handler("Model execution failed")

    try:
        for i, data in enumerate(list_data):
            enhanced_path = get_enhanced_path()
            save_image(processed_batch[i][0], enhanced_path)
            list_new_data.append({**data, "enhanced_file": enhanced_path})
        print("Processed images saved")
    except:
        exception_handler("Saving image failed")

    try:
        with open('data.json', 'w') as f:
            json.dump(list_new_data, f)
        print("JSON overwritten")
    except:
        exception_handler("Overwriting JSON failed")

    print(f"Execution took {time.time() - start_time} seconds")
