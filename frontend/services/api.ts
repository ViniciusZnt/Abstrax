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

      // Primeiro, vamos criar o registro da arte
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/arts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          isPublic,
          tags: tags ? JSON.parse(tags as string) : [],
          metadata: metadata ? JSON.parse(metadata as string) : {},
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao criar arte');
      }

      const art = await response.json();

      // Fazer upload da imagem
      const imageFormData = new FormData();
      imageFormData.append('image', imageBlob);
      const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/arts/${art.id}/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: imageFormData,
      });

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        throw new Error(error.message || 'Erro ao fazer upload da imagem');
      }

      return uploadResponse.json();
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
}; 