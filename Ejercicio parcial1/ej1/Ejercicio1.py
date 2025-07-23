from collections import deque
from PIL import Image, ImageDraw

def find_route(maze, K, N):
    # Movimientos posibles: norte, sur, este y oeste.
    directions = {'N': (-1, 0), 'S': (1, 0), 'E': (0, 1), 'O': (0, -1)}
    
    entrance = None
    for i in range(N):
        for j in range(N):
            if maze[i][j] == 'E':
                entrance = (i, j)
                break
        if entrance is not None:
            break
    if entrance is None:
        print("Entrada no encontrada")
        return -1, ""
    
    queue = deque()
    queue.append((entrance[0], entrance[1], "", 0))
    
    visited = {entrance: 0}

    while queue:
        x, y, path, danger_count = queue.popleft()

        if maze[x][y] == 'T':
            return len(path), path

        # Explora las celdas adyacentes
        for direction, (dx, dy) in directions.items():
            new_x = x + dx
            new_y = y + dy
            
            if 0 <= new_x < N and 0 <= new_y < N and maze[new_x][new_y] != '#':
                new_danger = danger_count
                if maze[new_x][new_y] == 'X':
                    new_danger += 1
                    
                if new_danger <= K:
                    if (new_x, new_y) not in visited or new_danger < visited[(new_x, new_y)]:
                        visited[(new_x, new_y)] = new_danger
                        queue.append((new_x, new_y, path + direction, new_danger))
    
    return -1, ""

def main():
    maze = []
    result = None
    try:
        with open('mapa_pirata.txt', 'r', encoding='utf-8') as file:
            K = int(file.readline().strip())
            N = int(file.readline().strip())
            for _ in range(N):
                row = file.readline().strip()
                maze.append(list(row))
            result = find_route(maze, K, N)
    except FileNotFoundError:
        print("No se encontró el archivo de entrada")
        return
        
    with open('ruta_tesoro.txt', 'w', encoding='utf-8') as output:
        output.write(str(result[0]) + '\n')
        if result[0] != -1:
            output.write(result[1])
    print("Se creó el archivo de salida ruta_tesoro.txt")
    
    CELL_SIZE = 20 
    width, height = N * CELL_SIZE, N * CELL_SIZE
    image = Image.new("RGB", (width, height), "white")
    draw = ImageDraw.Draw(image)
    
    colors = {
        'E': "green",
        'T': "gold",
        '#': "black",
        '.': "white",
        'X': "red"
    }
    
    for i, row in enumerate(maze):
        for j, cell in enumerate(row):
            top_left = (j * CELL_SIZE, i * CELL_SIZE)
            bottom_right = ((j + 1) * CELL_SIZE, (i + 1) * CELL_SIZE)
            color = colors.get(cell, "white")
            draw.rectangle([top_left, bottom_right], fill=color, outline="gray")
    
    if result[0] != -1:
        entrance = None
        for i in range(N):
            for j in range(N):
                if maze[i][j] == 'E':
                    entrance = (i, j)
                    break
            if entrance is not None:
                break
                
        route_points = []
        current = entrance
        center = (current[1] * CELL_SIZE + CELL_SIZE // 2, current[0] * CELL_SIZE + CELL_SIZE // 2)
        route_points.append(center)
        direction_offsets = {'N': (-1, 0), 'S': (1, 0), 'E': (0, 1), 'O': (0, -1)}
        for step in result[1]:
            dx, dy = direction_offsets[step]
            current = (current[0] + dx, current[1] + dy)
            center = (current[1] * CELL_SIZE + CELL_SIZE // 2, current[0] * CELL_SIZE + CELL_SIZE // 2)
            route_points.append(center)
            
        draw.line(route_points, fill="blue", width=3)
    
    image.save("mapa_solucion.png")
    image.show()
    print("Se creó la imagen mapa_solucion.png")

if __name__ == "__main__":
    main()
