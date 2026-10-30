# Eric Chan Photography

A static site (no build step) for GitHub Pages.

## Add photos
- **Recipes:** put one photo per recipe in `photos/recipes/`, named after the recipe's page name plus an extension, e.g. `birria-tacos.jpg`. The names are: cocktails, fun-see, kimchi-jjigae, tiramisu, sheng-jian-bao, matcha-lava-cake, sushi, beef-pepper-lunch, tteokbokki, fried-rice, vodka-pasta, castella-cake, ciabatta, dumplings, udon-noodles, creme-brulee, pizza-crust, no-knead-focaccia-bread, bolognese-sauce, japanese-milk-bread, blueberry-muffins, banana-bread, birria-tacos. `.jpg`, `.jpeg`, `.png` and `.webp` all work. Recipes without a photo show a colored tile.
- **Events:** drop images into `photos/events/`, then run `python3 tools/update-events.py` to refresh the list (or edit `photos/manifest.js` by hand). Photos show in file-name order, so name them `01-...jpg`, `02-...jpg` to control the order.
- Resize photos to about 2000px on the long edge first, so pages load quickly.

## Publish
Push this folder to a GitHub repository, then in the repository go to Settings > Pages and choose "Deploy from a branch", branch `main`, folder `/ (root)`. The site appears at `https://<username>.github.io/<repository>/`. Name the repository `<username>.github.io` to get `https://<username>.github.io/` instead.

## Edit recipes
Recipe text lives in `recipes.js`.
