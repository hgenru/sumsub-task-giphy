# sumsub-task-gify

Тестовое задание по созданию компонента-комбобокса для поиска по гифкам.
В [TASK.md](./TASK.md) можно найти оригинальное техзадание.

## Стартуем проект

```sh
npm install
```

```sh
npm run dev
```

## Детали имплементации

Перед началом разработки нужно обратить внимание на:

-   Вопросы логики:
    -   Дебаунс запросов
    -   Отмена предыдущих запросов
    -   Сохранение и обработка состояний запросов
-   Доступность:
    -   aria-параметры и их флаги
    -   навигация с помощью клавиатуры
    -   фокус и ховер
    -   использование нативных элементов
-   UX:
    -   На мобильном большой дропдаун может быть неудобен,
        лучше сделать как в нативном селекте большое модальное окно.
    -   На мобилке стоит сделать кнопку для закрытия этого окна.

## Как отображать гифки

Лучший вариант — видео. Но проблема с видео в том, что нативными
средствами видео не сделать респонсивным. Но в нашем случае это
не сильно мешает. Потому мы будем использовать видео.

Внутри тега `<video>` можно поместить картинку, которая может
работать как фоллбек. Но проблема в том, что по умолчанию
эта картинка тоже скачивается и идёт лишняя нагрузка на сеть.
Вместо этого лучше повесить коллбек на загрузку дорожки и
при ошибке включать фоллбечную картинку. При этом сама
картинка внутри себя может иметь фоллбек с `webp` на `gif`.
На практике эти перестраховки не очень нужны, потому что
если у пользователя браузер хотя бы пятилетней свежести,
то проблем с воспроизведением `mp4` у него быть не должно.

Интересный нюанс в том, что сами Giphy на своём сайте используют
`<picture>` с анимированным `webp`. Полагаю, что так делают как
раз из-за респонсивности.

## Что сделано, что делать дальше

Что сделано:

-   Вся базовая логика: запросы, статусы,
    сохранение состояний (не персистентное)
-   Скелетон анимация загрузки с антиблик
    анимацией появления лоадера.
-   Доступность: управление с клавиатуры, фокус,
    ховер, aria-параметры

Что дальше:

-   Нотификации об ошибках
-   Бесконечный скролл || пагинация
-   Предпросмотр выбранной гифки
-   Тесты
-   Более декларативный код
