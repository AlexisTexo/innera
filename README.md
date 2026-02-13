# Innera

![Logo de Innera](https://i.imgur.com/91yCzZ3.png)

Proyecto web de Innera.

Este proyecto forma parte de **theinnercode.net** y se publica en el subdominio:
`https://innera.theinnercode.net`

## Desarrollo local

```bash
npm install
npm run dev
```

## Scripts disponibles

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Flujo de ramas

Todos los cambios se deben aplicar primero en la rama `dev` y, una vez validados, hacer merge a `main`.

```bash
git checkout dev
git pull origin dev

# realizar cambios
git add .
git commit -m "mensaje"
git push origin dev

# luego integrar en main
git checkout main
git pull origin main
git merge dev
git push origin main
```
