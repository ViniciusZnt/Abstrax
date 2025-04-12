package repositories

import (
	"fmt"

	"github.com/ViniciusZnt/Abstrax/backend/models"
	"github.com/ViniciusZnt/Abstrax/backend/utils"
	"github.com/pocketbase/pocketbase"
)

// UserRepository contém os métodos para manipulação de usuários
type UserRepository struct {
	pb *pocketbase.PocketBase
}

// NewUserRepository cria uma nova instância do repositório de usuários
func NewUserRepository() *UserRepository {
	return &UserRepository{
		pb: utils.PB,
	}
}

// CreateUser cria um novo usuário
func (r *UserRepository) CreateUser(user *models.User) error {
	collection := r.pb.Collection("users")
	if collection == nil {
		return fmt.Errorf("collection users not found")
	}

	data := map[string]interface{}{
		"name":     user.Name,
		"email":    user.Email,
		"password": user.Password,
		"role":     user.Role,
	}
	if user.Avatar != "" {
		data["avatar"] = user.Avatar
	}

	_, err := collection.Create(data)
	if err != nil {
		return fmt.Errorf("failed to create user: %v", err)
	}

	return nil
}

// GetAllUsers retorna todos os usuários
func (r *UserRepository) GetAllUsers() ([]*models.User, error) {
	collection := r.pb.Collection("users")
	if collection == nil {
		return nil, fmt.Errorf("collection users not found")
	}

	records, err := collection.GetFullList(100)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch users: %v", err)
	}

	users := make([]*models.User, len(records))
	for i, record := range records {
		data := record.Data()
		users[i] = &models.User{
			ID:              record.Id,
			Name:            data["name"].(string),
			Email:           data["email"].(string),
			Role:            data["role"].(string),
			Avatar:          data["avatar"].(string),
			EmailVisibility: data["emailVisibility"].(bool),
			Verified:        data["verified"].(bool),
		}
	}

	return users, nil
}

// GetUserByID busca um usuário pelo ID
func (r *UserRepository) GetUserByID(id string) (*models.User, error) {
	collection := r.pb.Collection("users")
	if collection == nil {
		return nil, fmt.Errorf("collection users not found")
	}

	record, err := collection.GetFirstListItem(`id = "` + id + `"`)
	if err != nil {
		return nil, fmt.Errorf("user not found: %v", err)
	}

	data := record.Data()
	user := &models.User{
		ID:              record.Id,
		Name:            data["name"].(string),
		Email:           data["email"].(string),
		Role:            data["role"].(string),
		Avatar:          data["avatar"].(string),
		EmailVisibility: data["emailVisibility"].(bool),
		Verified:        data["verified"].(bool),
	}

	return user, nil
}

// UpdateUser atualiza os dados de um usuário
func (r *UserRepository) UpdateUser(user *models.User) error {
	collection := r.pb.Collection("users")
	if collection == nil {
		return fmt.Errorf("collection users not found")
	}

	data := map[string]interface{}{
		"name": user.Name,
		"role": user.Role,
	}
	if user.Avatar != "" {
		data["avatar"] = user.Avatar
	}
	if user.Password != "" {
		data["password"] = user.Password
	}

	_, err := collection.Update(user.ID, data)
	if err != nil {
		return fmt.Errorf("failed to update user: %v", err)
	}

	return nil
}

// DeleteUser remove um usuário pelo ID
func (r *UserRepository) DeleteUser(id string) error {
	collection := r.pb.Collection("users")
	if collection == nil {
		return fmt.Errorf("collection users not found")
	}

	err := collection.Delete(id)
	if err != nil {
		return fmt.Errorf("failed to delete user: %v", err)
	}

	return nil
}
