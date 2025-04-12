"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserHeader } from "@/components/layout/user-header"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { HexColorPicker } from "@/components/color-picker"
import { Info } from "lucide-react"

export default function CreateArtPage() {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [tags, setTags] = useState("")

  // Tipo de arte selecionado
  const [artType, setArtType] = useState("circular")

  // Parâmetros comuns
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  const [foregroundColor, setForegroundColor] = useState("#000000")
  const [canvasSize, setCanvasSize] = useState(1080)

  // Parâmetros para arte circular
  const [elements, setElements] = useState(100)
  const [radius, setRadius] = useState(30)
  const [lineWidth, setLineWidth] = useState(5)
  const [randomness, setRandomness] = useState(50)
  const [showArcs, setShowArcs] = useState(true)
  const [showRects, setShowRects] = useState(true)

  // Parâmetros para arte geométrica
  const [gridSize, setGridSize] = useState(10)
  const [shapeVariety, setShapeVariety] = useState(3)
  const [rotationAngle, setRotationAngle] = useState(0)
  const [symmetry, setSymmetry] = useState(false)
  const [colorVariety, setColorVariety] = useState(1)

  // Parâmetros para arte fluida
  const [layers, setLayers] = useState(5)
  const [turbulence, setTurbulence] = useState(50)
  const [flowSpeed, setFlowSpeed] = useState(50)
  const [colorBlending, setColorBlending] = useState(50)
  const [gradientColors, setGradientColors] = useState(["#ff0000", "#0000ff", "#00ff00"])

  // Parâmetros para arte de ruído
  const [noiseScale, setNoiseScale] = useState(0.01)
  const [noiseOctaves, setNoiseOctaves] = useState(4)
  const [noiseSpeed, setNoiseSpeed] = useState(0.5)
  const [noiseColorMode, setNoiseColorMode] = useState("gradient")
  const [noiseDetail, setNoiseDetail] = useState(50)
  const [noiseColors, setNoiseColors] = useState(["#000000", "#ffffff"])
  const [noiseFractalType, setNoiseFractalType] = useState("perlin")

  // Efeito para inicializar o canvas quando o componente montar
  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")
      if (ctx) {
        // Limpar o canvas
        ctx.fillStyle = backgroundColor
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      }
    }
  }, [backgroundColor])

  // Função para converter graus para radianos
  const degToRad = (degrees: number) => {
    return (degrees * Math.PI) / 180
  }

  // Função para gerar número aleatório dentro de um intervalo
  const random = (min: number, max: number) => {
    return Math.random() * (max - min) + min
  }

  // Implementação simplificada de ruído Perlin
  const noise = (() => {
    const permutation: number[] = []
    for (let i = 0; i < 256; i++) {
      permutation[i] = Math.floor(Math.random() * 256)
    }

    // Duplicar o array para evitar overflow
    const p: number[] = new Array(512)
    for (let i = 0; i < 512; i++) {
      p[i] = permutation[i & 255]
    }

    const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)

    const lerp = (t: number, a: number, b: number) => a + t * (b - a)

    const grad = (hash: number, x: number, y: number, z: number) => {
      const h = hash & 15
      const u = h < 8 ? x : y
      const v = h < 4 ? y : h === 12 || h === 14 ? x : z
      return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v)
    }

    return (x: number, y: number, z: number) => {
      const X = Math.floor(x) & 255
      const Y = Math.floor(y) & 255
      const Z = Math.floor(z) & 255

      x -= Math.floor(x)
      y -= Math.floor(y)
      z -= Math.floor(z)

      const u = fade(x)
      const v = fade(y)
      const w = fade(z)

      const A = p[X] + Y,
        AA = p[A] + Z,
        AB = p[A + 1] + Z
      const B = p[X + 1] + Y,
        BA = p[B] + Z,
        BB = p[B + 1] + Z

      return lerp(
        w,
        lerp(
          v,
          lerp(u, grad(p[AA], x, y, z), grad(p[BA], x - 1, y, z)),
          lerp(u, grad(p[AB], x, y - 1, z), grad(p[BB], x - 1, y - 1, z)),
        ),
        lerp(
          v,
          lerp(u, grad(p[AA + 1], x, y, z - 1), grad(p[BA + 1], x - 1, y, z - 1)),
          lerp(u, grad(p[AB + 1], x, y - 1, z - 1), grad(p[BB + 1], x - 1, y - 1, z - 1)),
        ),
      )
    }
  })()

  // Função para gerar ruído fractal
  const fractalNoise = (x: number, y: number, z: number, octaves: number, persistence: number) => {
    let total = 0
    let frequency = 1
    let amplitude = 1
    let maxValue = 0

    for (let i = 0; i < octaves; i++) {
      let noiseValue = 0

      switch (noiseFractalType) {
        case "perlin":
          noiseValue = noise(x * frequency, y * frequency, z * frequency)
          break
        case "simplex":
          // Simulação simplificada de ruído simplex
          noiseValue = noise(x * frequency, y * frequency, z * frequency) * 0.5 + 0.5
          break
        case "cellular":
          // Simulação simplificada de ruído celular
          const nx = Math.floor(x * frequency)
          const ny = Math.floor(y * frequency)
          const nz = Math.floor(z * frequency)
          noiseValue = Math.abs(noise(nx, ny, nz))
          break
        default:
          noiseValue = noise(x * frequency, y * frequency, z * frequency)
      }

      total += noiseValue * amplitude

      maxValue += amplitude

      amplitude *= persistence
      frequency *= 2
    }

    return total / maxValue
  }

  // Função para gerar arte circular (baseada no primeiro exemplo)
  const generateCircularArt = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Limpar o canvas
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, width, height)

    ctx.fillStyle = foregroundColor
    ctx.strokeStyle = foregroundColor

    const cx = width * 0.5
    const cy = height * 0.5

    const w = width * 0.01
    const h = height * 0.1
    let x, y

    const num = elements
    const radiusValue = width * (radius / 100)
    const randomFactor = randomness / 100

    for (let i = 0; i < num; i++) {
      const slice = degToRad(360 / num)
      const angle = slice * i

      x = cx + radiusValue * Math.sin(angle)
      y = cy + radiusValue * Math.cos(angle)

      if (showRects) {
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(-angle)
        ctx.scale(random(0.4, 0.4 + randomFactor), random(1, 1 + 3 * randomFactor))

        ctx.beginPath()
        ctx.rect(-w * 0.5, random(0, -h * 0.1 * randomFactor), w, h)
        ctx.fill()
        ctx.restore()
      }

      if (showArcs) {
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(-angle)

        ctx.lineWidth = random(lineWidth * 0.5, lineWidth * 1.5)

        ctx.beginPath()
        ctx.arc(
          0,
          0,
          radiusValue * random(0.1, 0.1 + 0.7 * randomFactor),
          slice * random(1, -8 * randomFactor),
          slice * random(1, 5 * randomFactor),
        )
        ctx.stroke()

        ctx.restore()
      }
    }
  }

  // Função para gerar arte geométrica
  const generateGeometricArt = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Limpar o canvas
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, width, height)

    const cellSize = width / gridSize
    const shapes = ["rect", "circle", "triangle", "line", "cross"]
    const colors = [
      foregroundColor,
      `hsl(${Number.parseInt(foregroundColor.slice(1, 3), 16)}, 70%, 50%)`,
      `hsl(${Number.parseInt(foregroundColor.slice(3, 5), 16)}, 70%, 50%)`,
      `hsl(${Number.parseInt(foregroundColor.slice(5, 7), 16)}, 70%, 50%)`,
    ]

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const posX = x * cellSize
        const posY = y * cellSize

        // Aplicar simetria se ativada
        let drawX = posX
        let drawY = posY

        if (symmetry) {
          if (x >= gridSize / 2) {
            drawX = width - posX - cellSize
          }
          if (y >= gridSize / 2) {
            drawY = height - posY - cellSize
          }
        }

        ctx.save()
        ctx.translate(drawX + cellSize / 2, drawY + cellSize / 2)
        ctx.rotate(degToRad((rotationAngle * (x + y)) % 360))

        // Selecionar cor com base na variedade de cores
        const colorIndex = Math.floor(random(0, colorVariety)) % colors.length
        ctx.fillStyle = colors[colorIndex]
        ctx.strokeStyle = colors[colorIndex]

        // Selecionar forma com base na variedade de formas
        const shapeIndex = Math.floor(random(0, shapeVariety)) % shapes.length
        const shape = shapes[shapeIndex]

        const size = cellSize * 0.8

        switch (shape) {
          case "rect":
            ctx.fillRect(-size / 2, -size / 2, size, size)
            break
          case "circle":
            ctx.beginPath()
            ctx.arc(0, 0, size / 2, 0, Math.PI * 2)
            ctx.fill()
            break
          case "triangle":
            ctx.beginPath()
            ctx.moveTo(0, -size / 2)
            ctx.lineTo(size / 2, size / 2)
            ctx.lineTo(-size / 2, size / 2)
            ctx.closePath()
            ctx.fill()
            break
          case "line":
            ctx.lineWidth = size / 10
            ctx.beginPath()
            ctx.moveTo(-size / 2, 0)
            ctx.lineTo(size / 2, 0)
            ctx.stroke()
            break
          case "cross":
            ctx.lineWidth = size / 10
            ctx.beginPath()
            ctx.moveTo(-size / 2, 0)
            ctx.lineTo(size / 2, 0)
            ctx.moveTo(0, -size / 2)
            ctx.lineTo(0, size / 2)
            ctx.stroke()
            break
        }

        ctx.restore()
      }
    }
  }

  // Função para gerar arte fluida
  const generateFluidArt = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Limpar o canvas
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, width, height)

    // Criar camadas de "fluido"
    for (let layer = 0; layer < layers; layer++) {
      // Criar um gradiente para esta camada
      const gradient = ctx.createLinearGradient(
        random(0, width),
        random(0, height),
        random(0, width),
        random(0, height),
      )

      // Adicionar cores ao gradiente
      const colorCount = gradientColors.length
      for (let i = 0; i < colorCount; i++) {
        const color = gradientColors[i % colorCount]
        const alpha = (1 - layer / layers) * (colorBlending / 100)
        gradient.addColorStop(
          i / (colorCount - 1),
          `${color}${Math.floor(alpha * 255)
            .toString(16)
            .padStart(2, "0")}`,
        )
      }

      ctx.fillStyle = gradient

      // Desenhar formas fluidas
      ctx.beginPath()

      const points = 8 + Math.floor(random(0, 8))
      const centerX = width / 2 + random(-width / 4, width / 4)
      const centerY = height / 2 + random(-height / 4, height / 4)
      const maxRadius = Math.min(width, height) * 0.4 * (1 - layer / layers)

      // Criar pontos de controle para a curva
      const angleStep = (Math.PI * 2) / points
      const controlPoints = []

      for (let i = 0; i < points; i++) {
        const angle = i * angleStep
        const radiusFactor = 1 + random(-turbulence / 100, turbulence / 100)
        const radius = maxRadius * radiusFactor

        const x = centerX + Math.cos(angle + (layer * flowSpeed) / 100) * radius
        const y = centerY + Math.sin(angle + (layer * flowSpeed) / 100) * radius

        controlPoints.push({ x, y })
      }

      // Desenhar a curva fechada
      ctx.moveTo(controlPoints[0].x, controlPoints[0].y)

      for (let i = 0; i < points; i++) {
        const current = controlPoints[i]
        const next = controlPoints[(i + 1) % points]

        const cpX1 = current.x + (next.x - current.x) / 3
        const cpY1 = current.y + (next.y - current.y) / 3
        const cpX2 = current.x + (2 * (next.x - current.x)) / 3
        const cpY2 = current.y + (2 * (next.y - current.y)) / 3

        ctx.bezierCurveTo(cpX1, cpY1, cpX2, cpY2, next.x, next.y)
      }

      ctx.closePath()
      ctx.fill()
    }
  }

  // Função para gerar arte de ruído
  const generateNoiseArt = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Limpar o canvas
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, width, height)

    // Criar um buffer de imagem para manipulação de pixels
    const imageData = ctx.createImageData(width, height)
    const data = imageData.data

    // Parâmetros para o ruído
    const scale = noiseScale
    const octaves = noiseOctaves
    const persistence = noiseDetail / 100
    const z = noiseSpeed // Usado como "seed" ou terceira dimensão

    // Criar gradiente de cores
    const getColor = (value: number) => {
      if (noiseColorMode === "gradient") {
        // Interpolar entre as cores do gradiente
        const color1 = noiseColors[0]
        const color2 = noiseColors[1]

        // Extrair componentes RGB
        const r1 = Number.parseInt(color1.slice(1, 3), 16)
        const g1 = Number.parseInt(color1.slice(3, 5), 16)
        const b1 = Number.parseInt(color1.slice(5, 7), 16)

        const r2 = Number.parseInt(color2.slice(1, 3), 16)
        const g2 = Number.parseInt(color2.slice(3, 5), 16)
        const b2 = Number.parseInt(color2.slice(5, 7), 16)

        // Interpolar
        const r = Math.floor(r1 + (r2 - r1) * value)
        const g = Math.floor(g1 + (g2 - g1) * value)
        const b = Math.floor(b1 + (b2 - b1) * value)

        return [r, g, b]
      } else {
        // Modo monocromático
        const intensity = Math.floor(value * 255)
        return [intensity, intensity, intensity]
      }
    }

    // Gerar ruído para cada pixel
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Calcular valor de ruído
        const nx = x * scale
        const ny = y * scale

        // Usar ruído fractal para mais detalhes
        const noiseValue = fractalNoise(nx, ny, z, octaves, persistence)

        // Normalizar para 0-1
        const normalizedValue = (noiseValue + 1) * 0.5

        // Obter cor baseada no valor de ruído
        const [r, g, b] = getColor(normalizedValue)

        // Definir pixel
        const idx = (y * width + x) * 4
        data[idx] = r
        data[idx + 1] = g
        data[idx + 2] = b
        data[idx + 3] = 255 // Alpha (opacidade)
      }
    }

    // Desenhar a imagem no canvas
    ctx.putImageData(imageData, 0, 0)
  }

  const generateArt = () => {
    setIsGenerating(true)

    // Simulação de geração de arte
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")
      if (ctx) {
        const width = canvasRef.current.width
        const height = canvasRef.current.height

        // Gerar arte baseada no tipo selecionado
        switch (artType) {
          case "circular":
            generateCircularArt(ctx, width, height)
            break
          case "geometric":
            generateGeometricArt(ctx, width, height)
            break
          case "fluid":
            generateFluidArt(ctx, width, height)
            break
          case "noise":
            generateNoiseArt(ctx, width, height)
            break
          default:
            // Tipo padrão
            generateCircularArt(ctx, width, height)
        }
      }
    }

    // Simular tempo de processamento
    setTimeout(() => {
      setIsGenerating(false)
    }, 800)
  }

  const saveArt = () => {
    if (!title) {
      alert("Por favor, adicione um título para sua arte")
      return
    }

    setIsSaving(true)

    // Capturar a imagem do canvas
    const imageData = canvasRef.current?.toDataURL("image/png")

    // TODO: Integrar com o endpoint de salvamento do backend
    // const response = await fetch('/api/arts', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     title,
    //     description,
    //     isPublic,
    //     tags: tags.split(',').map(tag => tag.trim()),
    //     imageData,
    //     metadata: {
    //       artType,
    //       parameters: getArtParameters()
    //     }
    //   }),
    // })

    // Função para obter os parâmetros específicos do tipo de arte
    const getArtParameters = () => {
      switch (artType) {
        case "circular":
          return {
            backgroundColor,
            foregroundColor,
            elements,
            radius,
            lineWidth,
            randomness,
            showArcs,
            showRects,
          }
        case "geometric":
          return {
            backgroundColor,
            foregroundColor,
            gridSize,
            shapeVariety,
            rotationAngle,
            symmetry,
            colorVariety,
          }
        case "fluid":
          return {
            backgroundColor,
            layers,
            turbulence,
            flowSpeed,
            colorBlending,
            gradientColors,
          }
        case "noise":
          return {
            backgroundColor,
            noiseScale,
            noiseOctaves,
            noiseSpeed,
            noiseColorMode,
            noiseDetail,
            noiseColors,
            noiseFractalType,
          }
        default:
          return {}
      }
    }

    // Simulando salvamento bem-sucedido
    console.log("Salvando arte:", {
      title,
      description,
      isPublic,
      tags: tags.split(",").map((tag) => tag.trim()),
      imageDataLength: imageData?.length,
      metadata: {
        artType,
        parameters: getArtParameters(),
      },
    })

    setTimeout(() => {
      setIsSaving(false)
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <UserHeader />
      <div className="container py-6 px-4 md:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Criar Nova Arte</h1>
          <p className="text-muted-foreground">Personalize os parâmetros para gerar sua arte abstrata</p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_400px]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Visualização</CardTitle>
                <CardDescription>
                  Clique em "Gerar Arte" para criar uma nova obra baseada nos parâmetros
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center p-4">
                <div className="relative border rounded-lg overflow-hidden">
                  <canvas ref={canvasRef} width={600} height={400} className="bg-white" />
                  {isGenerating && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-2"></div>
                        <p>Gerando arte...</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button onClick={generateArt} disabled={isGenerating} size="lg">
                  {isGenerating ? "Gerando..." : "Gerar Arte"}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detalhes da Arte</CardTitle>
                <CardDescription>Adicione informações sobre sua criação</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Dê um nome à sua obra"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva sua obra"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                  <Input
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="abstrato, colorido, geométrico"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="public" checked={isPublic} onCheckedChange={setIsPublic} />
                  <Label htmlFor="public">Tornar público</Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveArt} disabled={isSaving || isGenerating} className="w-full">
                  {isSaving ? "Salvando..." : "Salvar Arte"}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tipo de Arte</CardTitle>
                <CardDescription>Escolha o estilo de arte que deseja criar</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="circular" onValueChange={setArtType}>
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="circular">Circular</TabsTrigger>
                    <TabsTrigger value="geometric">Geométrica</TabsTrigger>
                    <TabsTrigger value="fluid">Fluida</TabsTrigger>
                    <TabsTrigger value="noise">Ruído</TabsTrigger>
                  </TabsList>

                  <TabsContent value="circular" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Cor de Fundo</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start"
                              style={{ backgroundColor: backgroundColor }}
                            >
                              <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor }}></div>
                              {backgroundColor}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <HexColorPicker color={backgroundColor} onChange={setBackgroundColor} />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label>Cor Principal</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start"
                              style={{ backgroundColor: foregroundColor }}
                            >
                              <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: foregroundColor }}></div>
                              {foregroundColor}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <HexColorPicker color={foregroundColor} onChange={setForegroundColor} />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Número de Elementos</Label>
                        <span className="text-sm text-muted-foreground">{elements}</span>
                      </div>
                      <Slider
                        value={[elements]}
                        min={10}
                        max={300}
                        step={1}
                        onValueChange={(value) => setElements(value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Raio (%)</Label>
                        <span className="text-sm text-muted-foreground">{radius}%</span>
                      </div>
                      <Slider
                        value={[radius]}
                        min={5}
                        max={45}
                        step={1}
                        onValueChange={(value) => setRadius(value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Espessura da Linha</Label>
                        <span className="text-sm text-muted-foreground">{lineWidth}px</span>
                      </div>
                      <Slider
                        value={[lineWidth]}
                        min={1}
                        max={20}
                        step={1}
                        onValueChange={(value) => setLineWidth(value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Aleatoriedade</Label>
                        <span className="text-sm text-muted-foreground">{randomness}%</span>
                      </div>
                      <Slider
                        value={[randomness]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(value) => setRandomness(value[0])}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch id="show-arcs" checked={showArcs} onCheckedChange={setShowArcs} />
                        <Label htmlFor="show-arcs">Mostrar Arcos</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch id="show-rects" checked={showRects} onCheckedChange={setShowRects} />
                        <Label htmlFor="show-rects">Mostrar Retângulos</Label>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="geometric" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Cor de Fundo</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start"
                              style={{ backgroundColor: backgroundColor }}
                            >
                              <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor }}></div>
                              {backgroundColor}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <HexColorPicker color={backgroundColor} onChange={setBackgroundColor} />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label>Cor Principal</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start"
                              style={{ backgroundColor: foregroundColor }}
                            >
                              <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: foregroundColor }}></div>
                              {foregroundColor}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <HexColorPicker color={foregroundColor} onChange={setForegroundColor} />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Tamanho da Grade</Label>
                        <span className="text-sm text-muted-foreground">
                          {gridSize}x{gridSize}
                        </span>
                      </div>
                      <Slider
                        value={[gridSize]}
                        min={2}
                        max={20}
                        step={1}
                        onValueChange={(value) => setGridSize(value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Variedade de Formas</Label>
                        <span className="text-sm text-muted-foreground">{shapeVariety}</span>
                      </div>
                      <Slider
                        value={[shapeVariety]}
                        min={1}
                        max={5}
                        step={1}
                        onValueChange={(value) => setShapeVariety(value[0])}
                      />
                      <p className="text-xs text-muted-foreground">Quanto maior, mais tipos de formas serão usados</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Ângulo de Rotação</Label>
                        <span className="text-sm text-muted-foreground">{rotationAngle}°</span>
                      </div>
                      <Slider
                        value={[rotationAngle]}
                        min={0}
                        max={360}
                        step={5}
                        onValueChange={(value) => setRotationAngle(value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Variedade de Cores</Label>
                        <span className="text-sm text-muted-foreground">{colorVariety}</span>
                      </div>
                      <Slider
                        value={[colorVariety]}
                        min={1}
                        max={4}
                        step={1}
                        onValueChange={(value) => setColorVariety(value[0])}
                      />
                      <p className="text-xs text-muted-foreground">Quanto maior, mais cores serão usadas</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="symmetry" checked={symmetry} onCheckedChange={setSymmetry} />
                      <Label htmlFor="symmetry">Simetria</Label>
                    </div>
                  </TabsContent>

                  <TabsContent value="fluid" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Cor de Fundo</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            style={{ backgroundColor: backgroundColor }}
                          >
                            <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor }}></div>
                            {backgroundColor}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <HexColorPicker color={backgroundColor} onChange={setBackgroundColor} />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Número de Camadas</Label>
                        <span className="text-sm text-muted-foreground">{layers}</span>
                      </div>
                      <Slider
                        value={[layers]}
                        min={1}
                        max={10}
                        step={1}
                        onValueChange={(value) => setLayers(value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Turbulência</Label>
                        <span className="text-sm text-muted-foreground">{turbulence}%</span>
                      </div>
                      <Slider
                        value={[turbulence]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(value) => setTurbulence(value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Velocidade de Fluxo</Label>
                        <span className="text-sm text-muted-foreground">{flowSpeed}%</span>
                      </div>
                      <Slider
                        value={[flowSpeed]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(value) => setFlowSpeed(value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Mistura de Cores</Label>
                        <span className="text-sm text-muted-foreground">{colorBlending}%</span>
                      </div>
                      <Slider
                        value={[colorBlending]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(value) => setColorBlending(value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Cores do Gradiente</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {gradientColors.map((color, index) => (
                          <Popover key={index}>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full h-8" style={{ backgroundColor: color }} />
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <HexColorPicker
                                color={color}
                                onChange={(newColor) => {
                                  const newColors = [...gradientColors]
                                  newColors[index] = newColor
                                  setGradientColors(newColors)
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="noise" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Cor de Fundo</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start"
                              style={{ backgroundColor: backgroundColor }}
                            >
                              <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor }}></div>
                              {backgroundColor}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <HexColorPicker color={backgroundColor} onChange={setBackgroundColor} />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="noise-fractal-type">Tipo de Fractal</Label>
                        <Select value={noiseFractalType} onValueChange={setNoiseFractalType}>
                          <SelectTrigger id="noise-fractal-type">
                            <SelectValue placeholder="Selecione um tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="perlin">Perlin</SelectItem>
                            <SelectItem value="simplex">Simplex</SelectItem>
                            <SelectItem value="cellular">Celular</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Escala do Ruído</Label>
                        <span className="text-sm text-muted-foreground">{noiseScale.toFixed(3)}</span>
                      </div>
                      <Slider
                        value={[noiseScale * 1000]}
                        min={1}
                        max={50}
                        step={1}
                        onValueChange={(value) => setNoiseScale(value[0] / 1000)}
                      />
                      <p className="text-xs text-muted-foreground">Valores menores criam padrões mais amplos</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Número de Oitavas</Label>
                        <span className="text-sm text-muted-foreground">{noiseOctaves}</span>
                      </div>
                      <Slider
                        value={[noiseOctaves]}
                        min={1}
                        max={8}
                        step={1}
                        onValueChange={(value) => setNoiseOctaves(value[0])}
                      />
                      <p className="text-xs text-muted-foreground">Mais oitavas criam mais detalhes</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Detalhamento</Label>
                        <span className="text-sm text-muted-foreground">{noiseDetail}%</span>
                      </div>
                      <Slider
                        value={[noiseDetail]}
                        min={10}
                        max={90}
                        step={1}
                        onValueChange={(value) => setNoiseDetail(value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Velocidade</Label>
                        <span className="text-sm text-muted-foreground">{noiseSpeed.toFixed(1)}</span>
                      </div>
                      <Slider
                        value={[noiseSpeed * 10]}
                        min={1}
                        max={20}
                        step={1}
                        onValueChange={(value) => setNoiseSpeed(value[0] / 10)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="noise-color-mode">Modo de Cor</Label>
                      <Select value={noiseColorMode} onValueChange={setNoiseColorMode}>
                        <SelectTrigger id="noise-color-mode">
                          <SelectValue placeholder="Selecione um modo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gradient">Gradiente</SelectItem>
                          <SelectItem value="mono">Monocromático</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Cores do Ruído</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {noiseColors.map((color, index) => (
                          <Popover key={index}>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full h-8" style={{ backgroundColor: color }} />
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <HexColorPicker
                                color={color}
                                onChange={(newColor) => {
                                  const newColors = [...noiseColors]
                                  newColors[index] = newColor
                                  setNoiseColors(newColors)
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span>Dicas</span>
                  <Info className="h-4 w-4 ml-2" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <p>
                    <strong>Arte Circular:</strong> Experimente aumentar o número de elementos e a aleatoriedade para
                    criar padrões mais complexos.
                  </p>
                  <p>
                    <strong>Arte Geométrica:</strong> A simetria cria padrões interessantes, e a variedade de formas
                    adiciona complexidade.
                  </p>
                  <p>
                    <strong>Arte Fluida:</strong> Mais camadas criam profundidade, e a turbulência alta gera formas mais
                    orgânicas.
                  </p>
                  <p>
                    <strong>Arte de Ruído:</strong> Ajuste a escala para mudar entre padrões amplos e detalhados.
                    Experimente diferentes tipos de fractais para resultados únicos.
                  </p>
                  <p>Você pode gerar várias versões antes de salvar. Cada geração cria uma obra única!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

