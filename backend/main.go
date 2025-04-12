package main

import (
	"log"
	"net/http"

	"github.com/ViniciusZnt/Abstrax/backend/utils"
	"github.com/labstack/echo/v4"
)

func main() {
	e := echo.New()

	// Inicializa o PocketBase
	utils.InitPocketBase()

	// Rota de teste para verificar conexão com o banco
	e.GET("/test-db", func(c echo.Context) error {
		if utils.PB == nil {
			return c.String(http.StatusInternalServerError, "Erro ao conectar ao PocketBase")
		}
		return c.String(http.StatusOK, "PocketBase conectado com sucesso!")
	})

	// Iniciar o servidor
	log.Println("Servidor rodando em http://localhost:8080")
	e.Logger.Fatal(e.Start(":8080"))
}
