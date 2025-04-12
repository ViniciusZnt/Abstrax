package utils

import (
	"log"

	"github.com/pocketbase/pocketbase"
)

var PB *pocketbase.PocketBase

func InitPocketBase() {
	PB = pocketbase.New()

	if err := PB.Start(); err != nil {
		log.Fatal("Erro ao iniciar o PocketBase:", err)
	}
}
