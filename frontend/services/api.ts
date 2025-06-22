interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  website?: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
  };
  createdAt: string;
  _count: {
    arts: number;
    albums: number;
  };
  totalLikes: number;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface Art {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  isPublic: boolean;
  createdAt: string;
  likes: number;
  creator: {
    id: string;
    name: string;
  };
  albumId?: string;
}

interface Album {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  tags?: any;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    name: string;
  };
  arts?: Art[];
  _count?: {
    arts: number;
  };
}

export const api = {
  register: async (data: RegisterData): Promise<User> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao registrar usuário');
    }

    return response.json();
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao fazer login');
    }

    return response.json();
  },

  arts: {
    // Buscar todas as artes do usuário
    getMyArts: async (): Promise<Art[]> => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Usuário não autenticado');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/arts/user/arts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao buscar artes');
      }

      return response.json();
    },

    // Criar uma nova arte
    create: async (data: FormData): Promise<Art> => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Usuário não autenticado');

      // Converter FormData para objeto JSON
      const imageBlob = data.get('image') as Blob;
      const name = data.get('name') as string;
      const description = data.get('description') as string;
      const isPublic = data.get('isPublic') === 'true';
      const tags = data.get('tags');
      const metadata = data.get('metadata');

      if (!name || name.trim() === '') {
        throw new Error('Nome da arte é obrigatório');
      }

      if (!imageBlob) {
        throw new Error('Imagem é obrigatória');
      }

      console.log('Iniciando criação de arte:', { name, description, isPublic });

      // Primeiro, vamos criar o registro da arte
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/arts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description?.trim() || '',
          isPublic,
          tags: tags ? JSON.parse(tags as string) : [],
          metadata: metadata ? JSON.parse(metadata as string) : {},
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Erro ao criar arte';
        
        try {
          const error = JSON.parse(errorText);
          errorMessage = error.error || error.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const art = await response.json();
      console.log('Arte criada:', { artId: art.id });

      if (!art.id) {
        throw new Error('Erro: resposta inválida do servidor ao criar arte');
      }

      // Fazer upload da imagem
      const imageFormData = new FormData();
      imageFormData.append('image', imageBlob);
      
      console.log('Iniciando upload de imagem para arte:', art.id);
      
      const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/arts/${art.id}/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: imageFormData,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        let errorMessage = 'Erro ao fazer upload da imagem';
        
        try {
          const error = JSON.parse(errorText);
          errorMessage = error.error || error.message || errorMessage;
        } catch {
          // Se não conseguiu fazer parse do JSON, pode ser uma resposta não-JSON
          console.error('Resposta não-JSON do servidor:', errorText);
          errorMessage = 'Erro no servidor ao processar imagem';
        }
        
        throw new Error(errorMessage);
      }

      // Verificar se a resposta é JSON válido
      const responseText = await uploadResponse.text();
      let finalArt;
      
      try {
        finalArt = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Erro ao fazer parse da resposta:', parseError);
        console.error('Resposta recebida:', responseText);
        throw new Error('Erro: resposta inválida do servidor ao fazer upload da imagem');
      }

      console.log('Upload de imagem concluído:', { artId: finalArt.id });
      return finalArt;
    },

    // Atualizar uma arte
    update: async (id: string, data: FormData): Promise<Art> => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Usuário não autenticado');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/arts/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: data,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao atualizar arte');
      }

      return response.json();
    },

    // Deletar uma arte
    delete: async (id: string): Promise<void> => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Usuário não autenticado');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/arts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao deletar arte');
      }
    },

    // Alternar visibilidade da arte (público/privado)
    toggleVisibility: async (id: string): Promise<Art> => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Usuário não autenticado');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/arts/${id}/visibility`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao alterar visibilidade da arte');
      }

      return response.json();
    },

    // Obter URL da imagem de uma arte
    getImageUrl: (artId: string): string => {
      return `${process.env.NEXT_PUBLIC_API_URL}/arts/${artId}/image`;
    },

    // Buscar todas as artes públicas (sem autenticação)
    getPublicArts: async (): Promise<Art[]> => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/arts/public`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao buscar artes públicas');
      }

      return response.json();
    },
  },

  users: {
    // Obter perfil do usuário
    getProfile: async (): Promise<User> => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Usuário não autenticado');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao buscar perfil');
      }

      return response.json();
    },

    // Atualizar perfil do usuário
    updateProfile: async (data: {
      name: string;
      bio?: string;
      website?: string;
      socialLinks?: {
        instagram?: string;
        twitter?: string;
      };
    }): Promise<User> => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Usuário não autenticado');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao atualizar perfil');
      }

      return response.json();
    },

    // Alterar senha
    changePassword: async (data: {
      currentPassword: string;
      newPassword: string;
    }): Promise<void> => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Usuário não autenticado');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao alterar senha');
      }
    },

    // Upload de avatar
    uploadAvatar: async (file: File): Promise<void> => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Usuário não autenticado');

      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao fazer upload do avatar');
      }
    },

    // Obter URL do avatar
    getAvatarUrl: (userId: string): string => {
      return `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/avatar`;
    },
  },

  albums: {
    // Buscar todos os álbuns do usuário
    getMyAlbums: async (): Promise<Album[]> => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Usuário não autenticado');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/albums/user/albums`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao buscar álbuns');
      }

      return response.json();
    },

    // Criar um novo álbum
    create: async (data: {
      title: string;
      description?: string;
      imageUrl?: string;
      tags?: any;
    }): Promise<Album> => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Usuário não autenticado');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/albums`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao criar álbum');
      }

      return response.json();
    },

    // Buscar um álbum específico
    getById: async (id: string): Promise<Album> => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Usuário não autenticado');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/albums/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao buscar álbum');
      }

      return response.json();
    },

    // Buscar artes de um álbum
    getArts: async (id: string): Promise<Art[]> => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Usuário não autenticado');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/albums/${id}/arts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao buscar artes do álbum');
      }

      return response.json();
    },

    // Atualizar um álbum
    update: async (id: string, data: {
      title?: string;
      description?: string;
      imageUrl?: string;
      tags?: any;
    }): Promise<Album> => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Usuário não autenticado');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/albums/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao atualizar álbum');
      }

      return response.json();
    },

    // Deletar um álbum
    delete: async (id: string): Promise<void> => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Usuário não autenticado');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/albums/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao deletar álbum');
      }
    },

    // Mover arte para um álbum
    moveArt: async (artId: string, albumId: string | null): Promise<Art> => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Usuário não autenticado');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/albums/art/${artId}/move`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ albumId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao mover arte');
      }

      return response.json();
    },
  },
}; 