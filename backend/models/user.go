package models

// User representa o modelo de usuário baseado nas collations do PocketBase
type User struct {
	ID              string `json:"id,omitempty"`              // ID do sistema
	Name            string `json:"name"`                      // Nome do usuário
	Avatar          string `json:"avatar,omitempty"`          // URL do avatar do usuário
	Role            string `json:"role"`                      // Papel/função do usuário
	Email           string `json:"email"`                     // Email do sistema
	EmailVisibility bool   `json:"emailVisibility,omitempty"` // Visibilidade do email (sistema)
	Password        string `json:"password,omitempty"`        // Senha do sistema
	TokenKey        string `json:"tokenKey,omitempty"`        // Chave do token do sistema
	Verified        bool   `json:"verified,omitempty"`        // Status de verificação do usuário
}
