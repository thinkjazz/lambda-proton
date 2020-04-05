<script>
    let title = "Пагинация | UI | Пользовательский Интерфейс";
    import Breadcrumb from "sveltestrap/src/Breadcrumb.svelte";
    import BreadcrumbItem from "sveltestrap/src/BreadcrumbItem.svelte";
    import Row from "sveltestrap/src/Row.svelte";
    import Button from "sveltestrap/src/Button.svelte";
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
<h1 class="mt-4">Группы полей</h1>
<Breadcrumb class="mb-4">
    <BreadcrumbItem active>Группы полей</BreadcrumbItem>
</Breadcrumb>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Группы полей</h2>
        <div class="input-group">
            <div addontype="prepend" class="input-group-prepend"><span class="input-group-text">@</span></div>
            <input placeholder="username" id="" type="text" class="form-control" name=""></div>
        <br>
        <div class="input-group">
            <div addontype="prepend" class="input-group-prepend"><span class="input-group-text">
            <input addon="true"  aria-label="Checkbox for following text input"
                   id=""
                   type="checkbox"
                   class="" name=""
                   placeholder=""
                   value=""></span>
            </div>
            <input placeholder="Check it out" id="" type="text" class="form-control" name=""></div>
        <br>
        <div class="input-group"><input placeholder="юзернейм" id="" type="text" class="form-control" name="">
            <div addontype="append" class="input-group-append"><span class="input-group-text">@example.com</span></div>
        </div>
        <br>
        <div class="input-group">
            <div addontype="prepend" class="input-group-prepend"><span class="input-group-text">$</span> <span
                    class="input-group-text">$</span></div>
            <input placeholder="Dolla dolla billz yo!" id="" type="text" class="form-control" name="">
            <div addontype="append" class="input-group-append"><span class="input-group-text">$</span> <span
                    class="input-group-text">$</span></div>
        </div>
        <br>
        <div class="input-group">
            <div addontype="prepend" class="input-group-prepend"><span class="input-group-text">$</span></div>
            <input placeholder="Amount" min="0" max="100" step="1" id="" type="number" class="form-control" name="">
            <div addontype="append" class="input-group-append"><span class="input-group-text">.00</span></div>
        </div>
    </div>
</Row>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Размеры</h2>

    <div>
        <div size="lg" class="input-group input-group-lg">
            <div addontype="prepend" class="input-group-prepend"><span class="input-group-text">@lg</span></div>
            <input id="" type="text" class="form-control" name="" placeholder=""></div>
        <br>
        <div class="input-group">
            <div addontype="prepend" class="input-group-prepend"><span class="input-group-text">@normal</span></div>
            <input id="" type="text" class="form-control" name="" placeholder=""></div>
        <br>
        <div size="sm" class="input-group input-group-sm">
            <div addontype="prepend" class="input-group-prepend"><span class="input-group-text">@sm</span></div>
            <input id="" type="text" class="form-control" name="" placeholder=""></div>
    </div>
    </div>
</Row>
