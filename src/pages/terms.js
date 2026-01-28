/**
 * Terms of Service Page
 * Display terms and conditions for using the platform
 */

export function renderTerms() {
    const content = document.getElementById('content')
    
    content.innerHTML = `
        <div class="container py-5">
            <div class="row justify-content-center">
                <div class="col-lg-9">
                    <h1 class="mb-4">
                        <i class="bi bi-file-text"></i> Условия за ползване
                    </h1>
                    
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">1. Общи условия</h5>
                            <p>Като използвате платформата Ретро Бартер, вие се съгласявате с настоящите условия за ползване. Платформата служи единствено за свързване на потребители, желаещи да обменят ретро компютри и части.</p>
                        </div>
                    </div>
                    
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">2. Регистрация и профил</h5>
                            <ul class="mb-0">
                                <li>Регистрацията е задължителна за публикуване на обяви</li>
                                <li>Потребителите носят отговорност за сигурността на своя профил</li>
                                <li>Забранено е създаването на множество фалшиви профили</li>
                                <li>Предоставената информация трябва да бъде точна и актуална</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">3. Обяви</h5>
                            <ul class="mb-0">
                                <li>Публикуваните обяви трябва да съответстват на реални артикули</li>
                                <li>Забранени са измамни, неточни или подвеждащи описания</li>
                                <li>Снимките трябва да показват реалния артикул</li>
                                <li>Забранена е продажбата на нелегални или опасни предмети</li>
                                <li>Администраторите имат право да премахнат неподходящи обяви</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">4. Транзакции и бартер</h5>
                            <ul class="mb-0">
                                <li>Всички транзакции се извършват директно между потребителите</li>
                                <li>Платформата не носи отговорност за качеството или състоянието на артикулите</li>
                                <li>Потребителите сами договарят условията за обмяна</li>
                                <li>Препоръчваме лична среща на публично място за безопасност</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">5. Забранени действия</h5>
                            <ul class="mb-0">
                                <li>Спам, масови съобщения и реклами</li>
                                <li>Обидни, заплашителни или незаконни публикации</li>
                                <li>Нарушаване на авторски права или интелектуална собственост</li>
                                <li>Опити за хакване или компрометиране на системата</li>
                                <li>Използване на автоматизирани инструменти (ботове)</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">6. Лични данни и поверителност</h5>
                            <ul class="mb-0">
                                <li>Събираме само необходима информация за функциониране на платформата</li>
                                <li>Вашите данни няма да бъдат споделяни с трети страни без ваше съгласие</li>
                                <li>Имате право да изтриете профила си по всяко време</li>
                                <li>Използваме cookies за подобряване на потребителското изживяване</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">7. Отговорности</h5>
                            <ul class="mb-0">
                                <li>Платформата се предоставя "както е" без гаранции</li>
                                <li>Не носим отговорност за загуби или вреди от използването</li>
                                <li>Потребителите сами носят отговорност за своите транзакции</li>
                                <li>Препоръчваме винаги да проверявате артикулите преди обмяна</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">8. Изменения на условията</h5>
                            <p class="mb-0">Запазваме правото да променяме настоящите условия по всяко време. Промените влизат в сила веднага след публикуването им на платформата. Продължавайки да използвате услугата след промени, вие се съгласявате с новите условия.</p>
                        </div>
                    </div>
                    
                    <div class="card mb-4 bg-light">
                        <div class="card-body">
                            <h5 class="card-title">9. Контакт</h5>
                            <p class="mb-0">
                                <i class="bi bi-envelope"></i> При въпроси относно условията за ползване, свържете се с нас чрез <a href="#/contact">контактната форма</a> или Telegram групата.
                            </p>
                        </div>
                    </div>
                    
                    <div class="alert alert-info">
                        <i class="bi bi-info-circle"></i>
                        <strong>Последна актуализация:</strong> ${new Date().toLocaleDateString('bg-BG')}
                    </div>
                    
                    <div class="text-center mt-4">
                        <a href="#/auth" class="btn btn-primary me-2">
                            <i class="bi bi-person-check"></i> Приемам условията
                        </a>
                        <a href="#/" class="btn btn-outline-secondary">
                            <i class="bi bi-house"></i> Начало
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `
}
