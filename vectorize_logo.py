import os
import math
from PIL import Image

def get_color_class(r, g, b):
    # Background white / near white
    if r > 230 and g > 230 and b > 230:
        return 'bg'
    
    # Crimson (bright red / magenta hue)
    if r > 165 and g < 75 and b < 105:
        return 'crimson'
    
    # Maroon (dark wine red)
    if r > 65 and r <= 165 and g < 70 and b < 85:
        return 'maroon'
    
    # Black / Dark Grey (letters, base, lines)
    if r < 85 and g < 85 and b < 85:
        return 'black'
        
    # Interpolated antialiasing pixels
    if r > g * 1.4 and r > b * 1.2:
        if r > 145:
            return 'crimson'
        else:
            return 'maroon'
    
    return 'black'

def trace_mask_to_polygons(mask, width, height):
    edges = set()
    for y in range(height):
        for x in range(width):
            if mask[y][x]:
                if y == 0 or not mask[y-1][x]:
                    edges.add(((x, y), (x+1, y)))
                if x == width - 1 or not mask[y][x+1]:
                    edges.add(((x+1, y), (x+1, y+1)))
                if y == height - 1 or not mask[y+1][x]:
                    edges.add(((x+1, y+1), (x, y+1)))
                if x == 0 or not mask[y][x-1]:
                    edges.add(((x, y+1), (x, y)))

    edge_map = {}
    for p1, p2 in edges:
        edge_map.setdefault(p1, []).append(p2)

    visited_edges = set()
    loops = []

    for start_p in list(edge_map.keys()):
        for next_p in edge_map[start_p]:
            edge = (start_p, next_p)
            if edge in visited_edges:
                continue
            
            loop = [start_p]
            curr_p = next_p
            visited_edges.add(edge)

            while curr_p != start_p:
                loop.append(curr_p)
                outgoing = [p for p in edge_map.get(curr_p, []) if (curr_p, p) not in visited_edges]
                if not outgoing:
                    break
                next_node = outgoing[0]
                visited_edges.add((curr_p, next_node))
                curr_p = next_node

            if curr_p == start_p and len(loop) >= 4:
                loops.append(loop)

    return loops

def point_line_dist(pt, p1, p2):
    x, y = pt
    x1, y1 = p1
    x2, y2 = p2
    dx = x2 - x1
    dy = y2 - y1
    if dx == 0 and dy == 0:
        return math.hypot(x - x1, y - y1)
    t = max(0, min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)))
    proj_x = x1 + t * dx
    proj_y = y1 + t * dy
    return math.hypot(x - proj_x, y - proj_y)

def ramer_douglas_peucker(points, epsilon):
    if len(points) < 3:
        return points
    
    dmax = 0
    index = 0
    for i in range(1, len(points) - 1):
        d = point_line_dist(points[i], points[0], points[-1])
        if d > dmax:
            index = i
            dmax = d
            
    if dmax > epsilon:
        rec1 = ramer_douglas_peucker(points[:index+1], epsilon)
        rec2 = ramer_douglas_peucker(points[index:], epsilon)
        return rec1[:-1] + rec2
    else:
        return [points[0], points[-1]]

def simplify_loop(loop, epsilon=1.8):
    if len(loop) < 4:
        return loop
    pts = loop + [loop[0]]
    simplified = ramer_douglas_peucker(pts, epsilon)
    if simplified and simplified[-1] == simplified[0]:
        simplified.pop()
    return simplified

def polygon_area(loop):
    area = 0
    n = len(loop)
    for i in range(n):
        j = (i + 1) % n
        area += loop[i][0] * loop[j][1] - loop[j][0] * loop[i][1]
    return area / 2.0

def loops_to_svg_path(loops, offset_x=0, offset_y=0, min_area=60):
    path_cmds = []
    for loop in loops:
        if abs(polygon_area(loop)) < min_area:
            continue
        sim = simplify_loop(loop, epsilon=1.8)
        if len(sim) < 3:
            continue
        p0 = sim[0]
        cmd = [f"M {p0[0] - offset_x:.1f} {p0[1] - offset_y:.1f}"]
        for p in sim[1:]:
            cmd.append(f"L {p[0] - offset_x:.1f} {p[1] - offset_y:.1f}")
        cmd.append("Z")
        path_cmds.append(" ".join(cmd))
    return " ".join(path_cmds)

def main():
    img_path = 'public/images/idea-squad-logo-original.png'
    img = Image.open(img_path).convert('RGB')
    w, h = img.size

    masks = {
        'black': [[False]*w for _ in range(h)],
        'crimson': [[False]*w for _ in range(h)],
        'maroon': [[False]*w for _ in range(h)],
    }

    min_x, min_y, max_x, max_y = w, h, 0, 0
    mark_min_x, mark_min_y, mark_max_x, mark_max_y = w, h, 0, 0

    for y in range(h):
        for x in range(w):
            r, g, b = img.getpixel((x, y))
            cls = get_color_class(r, g, b)
            if cls in masks:
                masks[cls][y][x] = True
                if x < min_x: min_x = x
                if x > max_x: max_x = x
                if y < min_y: min_y = y
                if y > max_y: max_y = y
                
                # Bulb/brain mark area is above y=605 and x >= 650
                if x >= 650 and y <= 605:
                    if x < mark_min_x: mark_min_x = x
                    if x > mark_max_x: mark_max_x = x
                    if y < mark_min_y: mark_min_y = y
                    if y > mark_max_y: mark_max_y = y

    print(f"Overall logo BBox: {min_x}, {min_y} to {max_x}, {max_y}")
    print(f"Mark BBox: {mark_min_x}, {mark_min_y} to {mark_max_x}, {mark_max_y}")

    pad = 12
    view_x = max(0, min_x - pad)
    view_y = max(0, min_y - pad)
    view_w = (max_x - min_x) + pad * 2
    view_h = (max_y - min_y) + pad * 2

    print("Tracing black layer...")
    black_loops = trace_mask_to_polygons(masks['black'], w, h)
    print("Tracing crimson layer...")
    crimson_loops = trace_mask_to_polygons(masks['crimson'], w, h)
    print("Tracing maroon layer...")
    maroon_loops = trace_mask_to_polygons(masks['maroon'], w, h)

    black_path = loops_to_svg_path(black_loops, view_x, view_y, min_area=60)
    crimson_path = loops_to_svg_path(crimson_loops, view_x, view_y, min_area=40)
    maroon_path = loops_to_svg_path(maroon_loops, view_x, view_y, min_area=40)

    # 1. Full Light Logo (for dark backgrounds): black parts -> #F5F5F7, crimson -> #E11D48, maroon -> #7A1F33
    svg_light = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {view_w} {view_h}" width="{view_w}" height="{view_h}" fill="none">
  <!-- Idea Squad Agency - Vectorized Full Logo (Light for dark bg) -->
  <g fill-rule="evenodd">
    <path fill="#7A1F33" d="{maroon_path}" id="logo-maroon" />
    <path fill="#E11D48" d="{crimson_path}" id="logo-crimson" />
    <path fill="#F5F5F7" d="{black_path}" id="logo-text" />
  </g>
</svg>
'''
    with open('public/images/idea-squad-logo.svg', 'w', encoding='utf-8') as f:
        f.write(svg_light)
    print("Saved public/images/idea-squad-logo.svg")

    # 2. Full Dark Logo (original colors, for light backgrounds): black parts -> #1A1A1A
    svg_dark = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {view_w} {view_h}" width="{view_w}" height="{view_h}" fill="none">
  <!-- Idea Squad Agency - Vectorized Full Logo (Dark for light bg) -->
  <g fill-rule="evenodd">
    <path fill="#7A1F33" d="{maroon_path}" id="logo-maroon" />
    <path fill="#E11D48" d="{crimson_path}" id="logo-crimson" />
    <path fill="#1A1A1A" d="{black_path}" id="logo-text" />
  </g>
</svg>
'''
    with open('public/images/idea-squad-logo-dark.svg', 'w', encoding='utf-8') as f:
        f.write(svg_dark)
    print("Saved public/images/idea-squad-logo-dark.svg")

    # 3. Square Logo Mark (Bulb + Brain only)
    mark_pad = 16
    mark_w = (mark_max_x - mark_min_x) + mark_pad * 2
    mark_h = (mark_max_y - mark_min_y) + mark_pad * 2
    side = max(mark_w, mark_h)
    mark_vx = mark_min_x - (side - (mark_max_x - mark_min_x)) / 2
    mark_vy = mark_min_y - (side - (mark_max_y - mark_min_y)) / 2

    # Filter loops strictly inside mark region (bulb starts at x >= 665)
    mark_black_loops = [l for l in black_loops if any(p[0] >= 665 and p[1] <= 605 for p in l)]
    mark_crimson_loops = [l for l in crimson_loops if any(p[0] >= 665 and p[1] <= 605 for p in l)]
    mark_maroon_loops = [l for l in maroon_loops if any(p[0] >= 665 and p[1] <= 605 for p in l)]

    mark_black_path = loops_to_svg_path(mark_black_loops, mark_vx, mark_vy, min_area=30)
    mark_crimson_path = loops_to_svg_path(mark_crimson_loops, mark_vx, mark_vy, min_area=30)
    mark_maroon_path = loops_to_svg_path(mark_maroon_loops, mark_vx, mark_vy, min_area=30)

    svg_mark = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {side:.1f} {side:.1f}" width="{side:.1f}" height="{side:.1f}" fill="none">
  <!-- Idea Squad Agency - Logo Mark (Bulb + Brain) -->
  <g fill-rule="evenodd">
    <path fill="#7A1F33" d="{mark_maroon_path}" id="mark-maroon" />
    <path fill="#E11D48" d="{mark_crimson_path}" id="mark-crimson" />
    <path fill="#F5F5F7" d="{mark_black_path}" id="mark-base" />
  </g>
</svg>
'''
    with open('public/images/idea-squad-logo-mark.svg', 'w', encoding='utf-8') as f:
        f.write(svg_mark)
    print("Saved public/images/idea-squad-logo-mark.svg")

if __name__ == '__main__':
    main()
