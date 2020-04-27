<script>
    let title = "Custom Input | UI";
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
<h1 class="mt-4">Custom Input</h1>
<Breadcrumb class="mb-4">
    <BreadcrumbItem active>Custom Input</BreadcrumbItem>
</Breadcrumb>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Custom Input</h2>
<Form>
    <FormGroup>
        <Label for="exampleCheckbox">Checkbox</Label>
        <div>
            <CustomInput
                    type="checkbox"
                    id="exampleCustomCheckbox"
                    label="Click this custom checkbox." />
            <CustomInput
                    type="checkbox"
                    id="exampleCustomCheckbox2"
                    label="Or this one." />
            <CustomInput
                    type="checkbox"
                    id="exampleCustomCheckbox3"
                    label="But not this one, he's inactive."
                    disabled />
            <CustomInput
                    type="checkbox"
                    id="exampleCustomCheckbox4"
                    label="I can't click on this label to check!"
                    htmlFor="exampleCustomCheckbox4_X"
                    disabled />
        </div>
            </FormGroup>
    <FormGroup>
        <Label for="exampleCheckbox">Radio Buttons</Label>
        <div>
            <CustomInput
                    type="radio"
                    id="exampleCustomRadio"
                    name="customRadio"
                    label="Choose this custom radio button." />
            <CustomInput
                    type="radio"
                    id="exampleCustomRadio2"
                    name="customRadio"
                    label="And this" />
            <CustomInput
                    type="radio"
                    id="exampleCustomRadio3"
                    label="But not that, cuz it's disable"
                    disabled />
            <CustomInput
                    type="radio"
                    id="exampleCustomRadio4"
                    label="I can't click on this label to check!"
                    htmlFor="exampleCustomRadio4_X"
                    disabled />
        </div>
    </FormGroup>
    <FormGroup>
        <Label for="exampleCheckbox">Checkbox</Label>
        <div>
            <CustomInput
                    type="switch"
                    id="exampleCustomSwitch"
                    name="customSwitch"
                    label="Turn on this adjustable switch." />
            <CustomInput
                    type="switch"
                    id="exampleCustomSwitch2"
                    name="customSwitch"
                    label="Or this one." />
            <CustomInput
                    type="switch"
                    id="exampleCustomSwitch3"
                    label="But not this one, it's the one."
                    disabled />
            <CustomInput
                    type="switch"
                    id="exampleCustomSwitch4"
                    label="You can't press that mark to turn it on!"
                    htmlFor="exampleCustomSwitch4_X"
                    disabled />
        </div>
    </FormGroup>
    <FormGroup>
        <Label for="exampleCheckbox">Inline checkboxes</Label>
        <div>
            <CustomInput
                    type="checkbox"
                    id="exampleCustomInline"
                    label="Built-in special input"
                    inline />
            <CustomInput
                    type="checkbox"
                    id="exampleCustomInline2"
                    label="and one more"
                    inline />
        </div>
    </FormGroup>
    <FormGroup>
        <Label for="exampleCustomSelect">Custom select</Label>
        <CustomInput type="select" id="exampleCustomSelect" name="customSelect">
            <option value="">Take your pick</option>
            <option>Flea shampoo for cats</option>
            <option>Taiwanese Globe</option>
            <option>North Korean passport</option>
            <option>Box of fluorescent condoms (secondhand)</option>
            <option>injaw</option>
        </CustomInput>
    </FormGroup>
            <FormGroup>
                <Label for="exampleCustomMutlipleSelect">Custom multiply select</Label>
                <CustomInput
                        type="select"
                        id="exampleCustomMutlipleSelect"
                        name="customSelect"
                        multiple>
                    <option value="">Take your pick</option>
                    <option>Flea shampoo for cats</option>
                    <option>Taiwanese Globe</option>
                    <option>North Korean passport</option>
                    <option>Box of fluorescent condoms (secondhand)</option>
                    <option>injaw</option>
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
