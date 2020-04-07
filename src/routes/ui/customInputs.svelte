<script>
    let title = "Настраиваемые вводы | UI | Пользовательский Интерфейс";
    import  Breadcrumb  from "sveltestrap/src/Breadcrumb.svelte";
    import  BreadcrumbItem  from "sveltestrap/src/BreadcrumbItem.svelte";
    import  Row  from "sveltestrap/src/Row.svelte";
    import  Button from "sveltestrap/src/Button.svelte";
    import  CustomInput from "sveltestrap/src/CustomInput.svelte";
    import  Form from "sveltestrap/src/Form.svelte";
    import  FormGroup from "sveltestrap/src/FormGroup.svelte";
    import  FormText from "sveltestrap/src/FormText.svelte";
    import  Input from "sveltestrap/src/Input.svelte";
    import  Label from "sveltestrap/src/Label.svelte";
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>
<h1 class="mt-4">Настраиваемые вводы</h1>
<Breadcrumb class="mb-4">
    <BreadcrumbItem active>Настраиваемые вводы</BreadcrumbItem>
</Breadcrumb>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Настраиваемые вводы</h2>
<Form>
    <FormGroup>
        <Label for="exampleCheckbox">Чекбоксы</Label>
        <div>
            <CustomInput
                    type="checkbox"
                    id="exampleCustomCheckbox"
                    label="Отметьте этот пользовательский флажок" />
            <CustomInput
                    type="checkbox"
                    id="exampleCustomCheckbox2"
                    label="Или этот" />
            <CustomInput
                    type="checkbox"
                    id="exampleCustomCheckbox3"
                    label="Но не этот, он неактивный."
                    disabled />
            <CustomInput
                    type="checkbox"
                    id="exampleCustomCheckbox4"
                    label="Не могу нажать на эту этикетку, чтобы проверить!"
                    htmlFor="exampleCustomCheckbox4_X"
                    disabled />
        </div>
            </FormGroup>
    <FormGroup>
        <Label for="exampleCheckbox">Радио-кнопки</Label>
        <div>
            <CustomInput
                    type="radio"
                    id="exampleCustomRadio"
                    name="customRadio"
                    label="Выберите эту кастомную радио-кнопку" />
            <CustomInput
                    type="radio"
                    id="exampleCustomRadio2"
                    name="customRadio"
                    label="Или эту" />
            <CustomInput
                    type="radio"
                    id="exampleCustomRadio3"
                    label="Но не эту, она неактивна"
                    disabled />
            <CustomInput
                    type="radio"
                    id="exampleCustomRadio4"
                    label="Нельзя нажать на эту метку, чтобы выбрать!"
                    htmlFor="exampleCustomRadio4_X"
                    disabled />
        </div>
    </FormGroup>
    <FormGroup>
        <Label for="exampleCheckbox">Переключатели</Label>
        <div>
            <CustomInput
                    type="switch"
                    id="exampleCustomSwitch"
                    name="customSwitch"
                    label="Включите этот настраиваемый переключатель" />
            <CustomInput
                    type="switch"
                    id="exampleCustomSwitch2"
                    name="customSwitch"
                    label="Или этот" />
            <CustomInput
                    type="switch"
                    id="exampleCustomSwitch3"
                    label="Но только не этот, он того"
                    disabled />
            <CustomInput
                    type="switch"
                    id="exampleCustomSwitch4"
                    label="Нельзя нажать на эту метку, чтобы включить!"
                    htmlFor="exampleCustomSwitch4_X"
                    disabled />
        </div>
    </FormGroup>
    <FormGroup>
        <Label for="exampleCheckbox">Инлайновые чекбоксы</Label>
        <div>
            <CustomInput
                    type="checkbox"
                    id="exampleCustomInline"
                    label="Встроенный специальный ввод"
                    inline />
            <CustomInput
                    type="checkbox"
                    id="exampleCustomInline2"
                    label="и ещё один"
                    inline />
        </div>
    </FormGroup>
    <FormGroup>
        <Label for="exampleCustomSelect">Пользовательский выбор</Label>
        <CustomInput type="select" id="exampleCustomSelect" name="customSelect">
            <option value="">Выбери себе</option>
            <option>Кошачий шампунь от блох</option>
            <option>Глобус Тайваня</option>
            <option>Северокорейский паспорт</option>
            <option>Коробка люминесцентных презервативов (секондхенд)</option>
            <option>Вставная челюсть</option>
        </CustomInput>
    </FormGroup>
            <FormGroup>
                <Label for="exampleCustomMutlipleSelect">Пользовательский множественный выбор</Label>
                <CustomInput
                        type="select"
                        id="exampleCustomMutlipleSelect"
                        name="customSelect"
                        multiple>
                    <option value="">Выбери себе</option>
                    <option>Кошачий шампунь от блох</option>
                    <option>Глобус Тайваня</option>
                    <option>Северокорейский паспорт</option>
                    <option>Коробка люминесцентных презервативов (секондхенд)</option>
                    <option>Вставная челюсть</option>
                </CustomInput>
            </FormGroup>
            <FormGroup>
                <Label for="exampleCustomSelectDisabled">Пользовательский Выбор Отключено</Label>
                <CustomInput
                        type="select"
                        id="exampleCustomSelectDisabled"
                        name="customSelect"
                        disabled>
                    <option value="">Выбери себе</option>
                    <option>Кошачий шампунь от блох</option>
                    <option>Глобус Тайваня</option>
                    <option>Северокорейский паспорт</option>
                    <option>Коробка люминесцентных презервативов (секондхенд)</option>
                    <option>Вставная челюсть</option>
                </CustomInput>
            </FormGroup>
            <FormGroup>
                <Label for="exampleCustomMutlipleSelectDisabled">
                    Пользовательский Выбор множества Отключено
                </Label>
                <CustomInput
                        type="select"
                        id="exampleCustomMutlipleSelectDisabled"
                        name="customSelect"
                        multiple
                        disabled>
                    <option value="">Выбери себе</option>
                    <option>Кошачий шампунь от блох</option>
                    <option>Глобус Тайваня</option>
                    <option>Северокорейский паспорт</option>
                    <option>Коробка люминесцентных презервативов (секондхенд)</option>
                    <option>Вставная челюсть</option>
                </CustomInput>
            </FormGroup>
            <FormGroup>
                <Label for="exampleCustomFileBrowser">Файловый браузер</Label>
                <CustomInput type="file" id="exampleCustomFileBrowser" name="customFile" />
            </FormGroup>
            <FormGroup>
                <Label for="exampleCustomFileBrowser">Файловый браузер с пользовательской меткой</Label>
                <CustomInput
                        type="file"
                        id="exampleCustomFileBrowser"
                        name="customFile"
                        label="Эй, выбери файл!" />
            </FormGroup>
            <FormGroup>
                <Label for="exampleCustomFileBrowser">Браузер файлов Отключен</Label>
                <CustomInput
                        type="file"
                        id="exampleCustomFileBrowser"
                        name="customFile"
                        disabled />
            </FormGroup>
        </Form>
    </div>
</Row>
