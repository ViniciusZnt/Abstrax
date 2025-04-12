"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserHeader } from "@/components/user-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { AlertCircle, Upload } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// TODO: Substituir por dados da API quando o backend estiver pronto
const userData = {
  id: "user1",
  name: "João Silva",
  email: "joao@example.com",
  bio: "Artista digital apaixonado por cores e formas abstratas. Explorando os limites da criatividade através da tecnologia.",
  avatar: "/placeholder.svg?height=200&width=200",
  website: "https://joaosilva.com",
  socialLinks: {
    instagram: "joao.silva",
    twitter: "joaosilva",
  },
  createdAt: "Janeiro de 2023",
  totalArts: 12,
  totalAlbums: 3,
  totalLikes: 156,
}

export default function ProfilePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("info")
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formError, setFormError] = useState("")

  // Form state
  const [name, setName] = useState(userData.name)
  const [email, setEmail] = useState(userData.email)
  const [bio, setBio] = useState(userData.bio || "")
  const [website, setWebsite] = useState(userData.website || "")
  const [instagram, setInstagram] = useState(userData.socialLinks?.instagram || "")
  const [twitter, setTwitter] = useState(userData.socialLinks?.twitter || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // TODO: Buscar dados do usuário do backend
  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const response = await fetch('/api/users/me', {
  //         headers: {
  //           'Authorization': `Bearer ${localStorage.getItem('token')}`
  //         }
  //       })
  //       const data = await response.json()
  //       // Atualizar estados com os dados do usuário
  //       setName(data.name)
  //       setEmail(data.email)
  //       setBio(data.bio || "")
  //       // etc...
  //     } catch (error) {
  //       console.error("Erro ao buscar dados do usuário:", error)
  //     }
  //   }
  //   fetchUserData()
  // }, [])

  const handleSaveProfile = async () => {
    setFormError("")
    setIsSaving(true)

    try {
      // TODO: Integrar com o endpoint de atualização de perfil do backend
      // const response = await fetch('/api/users/me', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify({
      //     name,
      //     bio,
      //     website,
      //     socialLinks: {
      //       instagram,
      //       twitter
      //     }
      //   })
      // })

      // Simulando atualização bem-sucedida
      console.log("Atualizando perfil:", {
        name,
        bio,
        website,
        socialLinks: {
          instagram,
          twitter,
        },
      })

      setTimeout(() => {
        setIsSaving(false)
        setIsEditing(false)
      }, 1000)
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error)
      setFormError("Ocorreu um erro ao atualizar o perfil. Tente novamente.")
      setIsSaving(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")

    if (newPassword !== confirmPassword) {
      setFormError("As senhas não coincidem")
      return
    }

    setIsSaving(true)

    try {
      // TODO: Integrar com o endpoint de alteração de senha do backend
      // const response = await fetch('/api/users/me/password', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify({
      //     currentPassword,
      //     newPassword
      //   })
      // })

      // Simulando atualização bem-sucedida
      console.log("Alterando senha")

      setTimeout(() => {
        setIsSaving(false)
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        alert("Senha alterada com sucesso!")
      }, 1000)
    } catch (error) {
      console.error("Erro ao alterar senha:", error)
      setFormError("Ocorreu um erro ao alterar a senha. Verifique se a senha atual está correta.")
      setIsSaving(false)
    }
  }

  const handleAvatarUpload = () => {
    // TODO: Implementar upload de avatar
    alert("Funcionalidade de upload de avatar será implementada em breve!")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <UserHeader />
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] px-4 py-6 md:px-6">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardNav activeItem="profile" />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Meu Perfil</h1>
            {!isEditing && <Button onClick={() => setIsEditing(true)}>Editar Perfil</Button>}
          </div>

          <Tabs defaultValue="info" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="security">Segurança</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Perfil</CardTitle>
                  <CardDescription>
                    Gerencie suas informações pessoais e como elas aparecem para outros usuários
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={userData.avatar} alt={userData.name} />
                        <AvatarFallback className="text-2xl">{userData.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                          onClick={handleAvatarUpload}
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-1 flex-1">
                      {isEditing ? (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="name">Nome</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                              id="email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              disabled
                            />
                            <p className="text-xs text-muted-foreground">
                              Para alterar seu e-mail, entre em contato com o suporte.
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <h2 className="text-xl font-semibold">{userData.name}</h2>
                          <p className="text-sm text-muted-foreground">{userData.email}</p>
                          <p className="text-sm text-muted-foreground">Membro desde {userData.createdAt}</p>
                        </>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="bio">Biografia</Label>
                        <Textarea
                          id="bio"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          placeholder="Conte um pouco sobre você..."
                          rows={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder="https://seusite.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Redes Sociais</Label>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="instagram">Instagram</Label>
                            <div className="flex">
                              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                                @
                              </span>
                              <Input
                                id="instagram"
                                value={instagram}
                                onChange={(e) => setInstagram(e.target.value)}
                                className="rounded-l-none"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="twitter">Twitter</Label>
                            <div className="flex">
                              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                                @
                              </span>
                              <Input
                                id="twitter"
                                value={twitter}
                                onChange={(e) => setTwitter(e.target.value)}
                                className="rounded-l-none"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium">Biografia</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {userData.bio || "Nenhuma biografia adicionada."}
                        </p>
                      </div>

                      {userData.website && (
                        <div>
                          <h3 className="text-sm font-medium">Website</h3>
                          <a
                            href={userData.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline mt-1"
                          >
                            {userData.website}
                          </a>
                        </div>
                      )}

                      {(userData.socialLinks?.instagram || userData.socialLinks?.twitter) && (
                        <div>
                          <h3 className="text-sm font-medium">Redes Sociais</h3>
                          <div className="flex gap-4 mt-1">
                            {userData.socialLinks?.instagram && (
                              <a
                                href={`https://instagram.com/${userData.socialLinks.instagram}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline"
                              >
                                Instagram: @{userData.socialLinks.instagram}
                              </a>
                            )}
                            {userData.socialLinks?.twitter && (
                              <a
                                href={`https://twitter.com/${userData.socialLinks.twitter}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline"
                              >
                                Twitter: @{userData.socialLinks.twitter}
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-3xl font-bold">{userData.totalArts}</p>
                        <p className="text-sm text-muted-foreground">Obras Criadas</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-3xl font-bold">{userData.totalAlbums}</p>
                        <p className="text-sm text-muted-foreground">Álbuns</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-3xl font-bold">{userData.totalLikes}</p>
                        <p className="text-sm text-muted-foreground">Curtidas Recebidas</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
                {isEditing && (
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveProfile} disabled={isSaving}>
                      {isSaving ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Alterar Senha</CardTitle>
                  <CardDescription>Atualize sua senha para manter sua conta segura</CardDescription>
                </CardHeader>
                <form onSubmit={handleChangePassword}>
                  <CardContent className="space-y-4">
                    {formError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Erro</AlertTitle>
                        <AlertDescription>{formError}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="current-password">Senha Atual</Label>
                      <Input
                        id="current-password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nova Senha</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Alterando..." : "Alterar Senha"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sessões Ativas</CardTitle>
                  <CardDescription>Gerencie os dispositivos onde você está conectado</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Este dispositivo</p>
                        <p className="text-sm text-muted-foreground">Última atividade: Agora</p>
                      </div>
                      <Button variant="outline" size="sm" disabled>
                        Atual
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Chrome em Windows</p>
                        <p className="text-sm text-muted-foreground">Última atividade: 2 dias atrás</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Encerrar
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Encerrar Todas as Outras Sessões
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
                  <CardDescription>Ações irreversíveis relacionadas à sua conta</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    A exclusão da sua conta é permanente e removerá todos os seus dados, incluindo obras de arte, álbuns
                    e comentários.
                  </p>
                  <Button variant="destructive">Excluir Minha Conta</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

