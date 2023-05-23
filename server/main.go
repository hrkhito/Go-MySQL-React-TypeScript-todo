package main

import (
	"go-typescript-original-todo/handlers"
	"net/http"

	"github.com/rs/cors"
)

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/todos", handlers.TodoHandler)

	handler := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000"},
		AllowedMethods: []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete},
		AllowedHeaders: []string{"*"},
	}).Handler(mux)

	http.ListenAndServe(":8080", handler)
}
