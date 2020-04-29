<script>
    let title = "Input and text area | UI";
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
<h1 class="mt-4">Input</h1>
<Breadcrumb class="mb-4">
    <BreadcrumbItem active>Input</BreadcrumbItem>
</Breadcrumb>
<Row>
    <div class="col-xl-12">
        <h2 class="mt-4">Input</h2>
        <h4 class="mt-4">Example</h4>
    <Form>
        <FormGroup>
            <Label for="exampleEmail">Plain text (static)</Label>
            <Input plaintext value="Some plain text/static value." />
        </FormGroup>
        <FormGroup>
            <Label for="exampleEmail">Email</Label>
            <Input
                    type="email"
                    name="email"
                    id="exampleEmail"
                    placeholder="Enter your mail." />
        </FormGroup>
        <FormGroup>
            <Label for="examplePassword">Password</Label>
            <Input
                    type="password"
                    name="password"
                    id="examplePassword"
                    placeholder="Enter password" />
        </FormGroup>
        <FormGroup>
            <Label for="exampleUrl">Url</Label>
            <Input
                    type="url"
                    name="url"
                    id="exampleUrl"
                    placeholder="Enter url" />
        </FormGroup>
        <FormGroup>
            <Label for="exampleNumber">Number</Label>
            <Input
                    type="number"
                    name="number"
                    id="exampleNumber"
                    placeholder="Fill in the number" />
        </FormGroup>
        <FormGroup>
            <Label for="exampleDatetime">Datetime</Label>
            <Input
                    type="datetime"
                    name="datetime"
                    id="exampleDatetime"
                    placeholder="Enter datetime" />
        </FormGroup>
        <FormGroup>
            <Label for="exampleDate">Date</Label>
            <Input
                    type="date"
                    name="date"
                    id="exampleDate"
                    placeholder="Enter the date." />
        </FormGroup>
        <FormGroup>
            <Label for="exampleTime">Time</Label>
            <Input
                    type="time"
                    name="time"
                    id="exampleTime"
                    placeholder="Enter the time." />
        </FormGroup>
        <FormGroup>
            <Label for="exampleColor">Color</Label>
            <Input
                    type="color"
                    name="color"
                    id="exampleColor"
                    placeholder="Color placeholder" />
        </FormGroup>
        <FormGroup>
            <Label for="exampleSearch">Search</Label>
            <Input
                    type="search"
                    name="search"
                    id="exampleSearch"
                    placeholder="Enter a search query" />
        </FormGroup>
        <FormGroup>
            <Label for="exampleSelect">Selection(selector)</Label>
            <Input type="select" name="select" id="exampleSelect">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
            </Input>
        </FormGroup>
        <FormGroup>
            <Label for="exampleSelectMulti">Selection of several parameters</Label>
            <Input type="select" name="selectMulti" id="exampleSelectMulti" multiple>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
            </Input>
        </FormGroup>
        <FormGroup>
            <Label for="exampleText">Text area</Label>
            <Input type="textarea" name="text" id="exampleText" />
        </FormGroup>
        <FormGroup>
            <Label for="exampleFile">File</Label>
            <Input type="file" name="file" id="exampleFile" />
            <FormText color="muted">
                This is some kind of block-text help at the playlist level for the above input.
                It's a bit lighter and easily wrapped up in a new line.
            </FormText>
        </FormGroup>
        <FormGroup check>
            <Label check>
                <Input type="radio" />
                Option one is both - make sure you turn on why it's great.
            </Label>
        </FormGroup>
        <FormGroup check>
            <Label check>
                <Input type="checkbox" />
                Check me out.
            </Label>
        </FormGroup>
    </Form>
    </div>


</Row>
<Row>
    <div class="col-xl-12">
        <h2 class="mt-4">Binding</h2>
        <h4 class="mt-4">Example:</h4>
        <p>The recommended way to bind values to inputs is through <code> bind: value = yourBind in curly brackets  </code></p>
        <FormGroup>
            <Label>Start printing here</Label>
            <Input type="text" bind:value={inputValue} />
        </FormGroup>
        {#if inputValue}
            <p>Вы напечатали: {inputValue}</p>
        {/if}
    </div>
</Row>
<Row>
    <div class="col-xl-12">
        <h2 class="mt-4">Event Binding</h2>
        <h4 class="mt-4">Example:</h4>
        <p>You can also link directly with event handlers: <code>on:blur on:keydown on:keyup on:change on:input</code>.
            but it's not recommended if you're just tied to a simple value - Svelte doesn't respond. :-)
            If you need more exotic events, please follow the number <a href="https://github.com/bestguy/sveltestrap/issues/36">36.</a></p>
        <FormGroup>
            <Label> Start typing here</Label>
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
            <p><code>on:input</code> says you print: {inputValueEventBind}</p>
        {/if}
        {#if!focused}
            <p><code>on:blur</code> says you didn't remove focus from the input field.
        {:else}
            <p><code>on:focus</code> says you put the focus on the input field.
        {/if}
    </div>
</Row>
