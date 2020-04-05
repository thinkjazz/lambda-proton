<script>
    let title = "Инпуты и поля ввода | UI | Пользовательский Интерфейс";
    import  Breadcrumb  from "sveltestrap/src/Breadcrumb.svelte";
    import  BreadcrumbItem  from "sveltestrap/src/BreadcrumbItem.svelte";
    import  Row  from "sveltestrap/src/Row.svelte";

    import  Button from "sveltestrap/src/Button.svelte";
    import  Form from "sveltestrap/src/Form.svelte";
    import  FormGroup from "sveltestrap/src/FormGroup.svelte";
    import  FormText from "sveltestrap/src/FormText.svelte";
    import  Input from "sveltestrap/src/Input.svelte";
    import  Label from "sveltestrap/src/Label.svelte";

    let inputValue = "";
    let inputValueEventBind = "";
    let changeValue = "";
    let focused = false;
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>
<h1 class="mt-4">Поле ввода Input</h1>
<Breadcrumb class="mb-4">
    <BreadcrumbItem active>Поле ввода Input</BreadcrumbItem>
</Breadcrumb>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Поле ввода Input</h2>
        <Form>
            <FormGroup>
                <Label for="exampleEmail">Простой текст (статический)</Label>
                <Input plaintext value="Некоторый обычный текст/статическое значение" />
            </FormGroup>
            <FormGroup>
                <Label for="exampleEmail">Email</Label>
                <Input
                        type="email"
                        name="email"
                        id="exampleEmail"
                        placeholder="Введите почту" />
            </FormGroup>
            <FormGroup>
                <Label for="examplePassword">Пароль</Label>
                <Input
                        type="password"
                        name="password"
                        id="examplePassword"
                        placeholder="Введите пароль" />
            </FormGroup>
            <FormGroup>
                <Label for="exampleUrl">Url</Label>
                <Input
                        type="url"
                        name="url"
                        id="exampleUrl"
                        placeholder="введите url" />
            </FormGroup>
            <FormGroup>
                <Label for="exampleNumber">Номер</Label>
                <Input
                        type="number"
                        name="number"
                        id="exampleNumber"
                        placeholder="заполните номер" />
            </FormGroup>
            <FormGroup>
                <Label for="exampleDatetime">Сроки</Label>
                <Input
                        type="datetime"
                        name="datetime"
                        id="exampleDatetime"
                        placeholder="Введите сроки" />
            </FormGroup>
            <FormGroup>
                <Label for="exampleDate">Дата</Label>
                <Input
                        type="date"
                        name="date"
                        id="exampleDate"
                        placeholder="Введите дату" />
            </FormGroup>
            <FormGroup>
                <Label for="exampleTime">Время</Label>
                <Input
                        type="time"
                        name="time"
                        id="exampleTime"
                        placeholder="Введите время" />
            </FormGroup>
            <FormGroup>
                <Label for="exampleColor">Цвет</Label>
                <Input
                        type="color"
                        name="color"
                        id="exampleColor"
                        placeholder="Цветовой плейсхолдер" />
            </FormGroup>
            <FormGroup>
                <Label for="exampleSearch">Поиск</Label>
                <Input
                        type="search"
                        name="search"
                        id="exampleSearch"
                        placeholder="Введите запрос для поиска" />
            </FormGroup>
            <FormGroup>
                <Label for="exampleSelect">Выбор(Селектор)</Label>
                <Input type="select" name="select" id="exampleSelect">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                </Input>
            </FormGroup>
            <FormGroup>
                <Label for="exampleSelectMulti">Выбор нескольких параметров</Label>
                <Input type="select" name="selectMulti" id="exampleSelectMulti" multiple>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                </Input>
            </FormGroup>
            <FormGroup>
                <Label for="exampleText">Текстовая область</Label>
                <Input type="textarea" name="text" id="exampleText" />
            </FormGroup>
            <FormGroup>
                <Label for="exampleFile">Файл</Label>
                <Input type="file" name="file" id="exampleFile" />
                <FormText color="muted">
                Это какой-то блок-текст справки на уровне плейсхолдеров для вышеприведенного ввода.
                Это немного легче и легко обертывается в новую линию.
                </FormText>
            </FormGroup>
            <FormGroup check>
                <Label check>
                    <Input type="radio" />
                    Вариант первый - это и то, и то, и другое - обязательно включите, почему это здорово.
                </Label>
            </FormGroup>
            <FormGroup check>
                <Label check>
                    <Input type="checkbox" />
                    Проверьте меня
                </Label>
            </FormGroup>
        </Form>
    </div>
</Row>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Связывание: (Binding)</h2>
        <p>Рекомендуемый способ привязки значений к входам - ​​через <code> bind: value = yourBind в фигурных скобках </code></p>
        <FormGroup>
            <Label>Type here</Label>
            <Input type="text" bind:value={inputValue} />
        </FormGroup>
        {#if inputValue}
            <p>You typed: {inputValue}</p>
        {/if}
    </div>
</Row>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Привязка событий (Event Binding) </h2>
        <p>Вы также можете связать непосредственно с обработчиками событий: <code>on:blur on:focus on:keydown on:keyup on:change on:input</code>
            но это не рекомендуется, если вы просто привязаны к простому значению - Svelte не реагирует. :-)
            Если вам нужно больше экзотических событий, пожалуйста, следуйте номер <a href="https://github.com/bestguy/sveltestrap/issues/36">36.</a></p>
        <FormGroup>
            <Label>Type here</Label>
            <Input
                    type="text"
                    value={inputValueEventBind}
                    on:blur={() => focused = false}
                    on:focus={() => focused = true}
                            on:change={e => (changeValue = e.target.value)}
                            on:input={e => (inputValueEventBind = e.target.value)} />
        </FormGroup>
        {#if changeValue}
            <p><code>on:change</code> says you typed: {changeValue}</p>
        {/if}
        {#if inputValueEventBind}
            <p><code>on:input</code> says you are typing: {inputValueEventBind}</p>
        {/if}
        {#if !focused}
            <p><code>on:blur</code> says you are not focused.</p>
        {:else}
            <p><code>on:focus</code> says you are focused.</p>
        {/if}
    </div>
</Row>
