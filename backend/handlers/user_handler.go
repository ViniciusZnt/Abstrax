package handlers

import (
	"net/http"

	"github.com/ViniciusZnt/Abstrax/backend/models"
	"github.com/ViniciusZnt/Abstrax/backend/repositories"
	"github.com/labstack/echo/v4"
)

// Criar usuário
func CreateUserHandler(c echo.Context) error {
	type request struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		Name     string `json:"name"`
		Role     string `json:"role"`
		Avatar   string `json:"avatar,omitempty"`
	}

	req := new(request)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Dados inválidos"})
	}

	userRepo := repositories.NewUserRepository()
	user := &models.User{
		Name:     req.Name,
		Email:    req.Email,
		Password: req.Password,
		Role:     req.Role,
		Avatar:   req.Avatar,
	}

	err := userRepo.CreateUser(user)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": err.Error()})
	}

	return c.JSON(http.StatusCreated, user)
}

// Listar todos os usuários
func GetAllUsersHandler(c echo.Context) error {
	userRepo := repositories.NewUserRepository()
	users, err := userRepo.GetAllUsers()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, users)
}

// Buscar usuário por ID
func GetUserByIDHandler(c echo.Context) error {
	id := c.Param("id")
	userRepo := repositories.NewUserRepository()
	user, err := userRepo.GetUserByID(id)
	if err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"error": "Usuário não encontrado"})
	}
	return c.JSON(http.StatusOK, user)
}

// Atualizar usuário
func UpdateUserHandler(c echo.Context) error {
	id := c.Param("id")
	type request struct {
		Name     string `json:"name"`
		Role     string `json:"role"`
		Avatar   string `json:"avatar,omitempty"`
		Password string `json:"password,omitempty"`
	}

	req := new(request)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Dados inválidos"})
	}

	userRepo := repositories.NewUserRepository()
	user := &models.User{
		ID:       id,
		Name:     req.Name,
		Role:     req.Role,
		Avatar:   req.Avatar,
		Password: req.Password,
	}

	err := userRepo.UpdateUser(user)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, user)
}

// Deletar usuário
func DeleteUserHandler(c echo.Context) error {
	id := c.Param("id")
	userRepo := repositories.NewUserRepository()
	err := userRepo.DeleteUser(id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, echo.Map{"message": "Usuário deletado com sucesso"})
}
