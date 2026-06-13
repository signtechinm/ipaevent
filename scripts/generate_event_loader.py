import math
import os
import sys

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter


SIZE = 480
FRAME_COUNT = 36
FRAME_DURATION = 55
BACKGROUND = (9, 13, 66, 255)
COLORS = ((244, 162, 27, 255), (255, 255, 255, 235), (0, 143, 76, 255))


def radial_background():
    image = Image.new("RGBA", (SIZE, SIZE), BACKGROUND)
    pixels = image.load()

    for y in range(SIZE):
        for x in range(SIZE):
            distance = math.hypot(x - SIZE / 2, y - SIZE / 2) / (SIZE * 0.72)
            strength = max(0, 1 - distance)
            pixels[x, y] = (
                int(9 + 8 * strength),
                int(13 + 18 * strength),
                int(66 + 24 * strength),
                255,
            )

    return image


def make_frame(base, logo, frame_index):
    progress = frame_index / FRAME_COUNT
    phase = progress * math.tau
    frame = base.copy()

    glow = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_radius = 146 + int(8 * math.sin(phase))
    glow_draw.ellipse(
        (
            SIZE / 2 - glow_radius,
            SIZE / 2 - glow_radius,
            SIZE / 2 + glow_radius,
            SIZE / 2 + glow_radius,
        ),
        fill=(0, 101, 47, 72),
    )
    glow = glow.filter(ImageFilter.GaussianBlur(34))
    frame = Image.alpha_composite(frame, glow)

    rings = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    ring_draw = ImageDraw.Draw(rings)
    bounds = (55, 55, SIZE - 55, SIZE - 55)
    rotation = progress * 360

    for index, color in enumerate(COLORS):
        start = rotation + index * 120
        ring_draw.arc(bounds, start=start, end=start + 72, fill=color, width=9)

    inner_bounds = (76, 76, SIZE - 76, SIZE - 76)
    ring_draw.arc(
        inner_bounds,
        start=-rotation * 0.72,
        end=-rotation * 0.72 + 105,
        fill=(223, 8, 103, 190),
        width=3,
    )
    frame = Image.alpha_composite(frame, rings)

    particles = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    particle_draw = ImageDraw.Draw(particles)
    for index in range(9):
        angle = phase + index * math.tau / 9
        radius = 178 + 8 * math.sin(phase * 2 + index)
        x = SIZE / 2 + math.cos(angle) * radius
        y = SIZE / 2 + math.sin(angle) * radius
        particle_radius = 2 + (index % 2)
        particle_draw.ellipse(
            (x - particle_radius, y - particle_radius, x + particle_radius, y + particle_radius),
            fill=COLORS[index % len(COLORS)],
        )
    frame = Image.alpha_composite(frame, particles)

    scale = 0.93 + 0.025 * math.sin(phase)
    logo_size = (int(300 * scale), int(270 * scale))
    resized_logo = logo.resize(logo_size, Image.Resampling.LANCZOS)
    resized_logo = ImageEnhance.Brightness(resized_logo).enhance(1.03)

    logo_glow = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    logo_x = (SIZE - resized_logo.width) // 2
    logo_y = (SIZE - resized_logo.height) // 2
    logo_glow.alpha_composite(resized_logo, (logo_x, logo_y))
    logo_glow = logo_glow.filter(ImageFilter.GaussianBlur(13))
    logo_glow.putalpha(70)
    frame = Image.alpha_composite(frame, logo_glow)
    frame.alpha_composite(resized_logo, (logo_x, logo_y))

    return frame.convert("P", palette=Image.Palette.ADAPTIVE, colors=128)


def main():
    if len(sys.argv) != 3:
        raise SystemExit("Usage: generate_event_loader.py INPUT_LOGO OUTPUT_GIF")

    input_path, output_path = sys.argv[1:]
    logo = Image.open(input_path).convert("RGBA")
    logo.thumbnail((340, 305), Image.Resampling.LANCZOS)
    base = radial_background()
    frames = [make_frame(base, logo, index) for index in range(FRAME_COUNT)]

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    frames[0].save(
        output_path,
        save_all=True,
        append_images=frames[1:],
        duration=FRAME_DURATION,
        loop=0,
        disposal=2,
        optimize=True,
    )


if __name__ == "__main__":
    main()
