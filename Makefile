# устанавливаем зависимости
install:
	yarn

# хук для быстрого коммита
commit:
	npm version patch --no-git-tag-version && \
	git add . && \
	git commit -am "${m}" && \
	git push origin main

# запускаем в дев моде
dev: install
	yarn start:dev

# билдим в прод
build: install
	yarn build

# запускаем в прод моде
prod: build
	yarn start:prod

# деплой на проде, билд + запуск pm2 процесса
install_prod:
	git pull origin main && \
	build && \
	pm2 start dist/main.js --name bob && \
	pm2 startup systemd && \
	pm2 save

# быстрый деплой
deploy:
	git pull origin main && \
	build && \
	pm2 restart bob

# запуск бд
db:
	yarn db