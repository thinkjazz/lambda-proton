<script>
  import Card from "sveltestrap/src/Card.svelte";
  import CardBody from "sveltestrap/src/CardBody.svelte";
  import CardHeader from "sveltestrap/src/CardHeader.svelte";
  import CardFooter from "sveltestrap/src/CardFooter.svelte";
  import Form from "sveltestrap/src/Form.svelte";
  import FormGroup from "sveltestrap/src/FormGroup.svelte";
  import Label from "sveltestrap/src/Label.svelte";
  import Input from "sveltestrap/src/Input.svelte";
  import CustomInput from "sveltestrap/src/CustomInput.svelte";
  import Button from "sveltestrap/src/Button.svelte";
</script>

<div class="col-lg-8 mx-auto my-5">
  <Card class="shadow-lg border-0 rounded-lg mt-5">
    <CardHeader>
      <h3 class="text-center font-weight-light my-4">Настройки</h3>
    </CardHeader>
    <CardBody>
      <Form>
        <FormGroup>
          <Label for="name" class="small mb-1">Имя</Label>
          <Input
            class="py-4"
            type="text"
            name="first_name"
            placeholder="Введите имя" />
        </FormGroup>
        <FormGroup>
          <Label for="name" class="small mb-1">Фамилия</Label>
          <Input
            class="py-4"
            type="text"
            name="last_name"
            placeholder="Введите фамилию" />
        </FormGroup>
        <FormGroup>
          <Label for="exampleEmail" class="small mb-1">Email</Label>
          <Input
            class="py-4"
            type="email"
            name="email"
            id="exampleEmail"
            placeholder="Введите адрес электронной почты" />
        </FormGroup>
        <FormGroup>
          <Label for="examplePassword" class="small mb-1">Пароль</Label>
          <Input
            class="py-4"
            type="password"
            name="password"
            id="examplePassword"
            placeholder="Введите пароль" />
        </FormGroup>
        <FormGroup>
          <CustomInput
            type="checkbox"
            id="exampleCustomCheckbox"
            label="Запомнить пароль" />
        </FormGroup>
        <FormGroup
          class="d-flex align-items-center justify-content-between mt-4 mb-0">
          <Button block color="danger" href=".">Сохранить</Button>
        </FormGroup>
      </Form>
    </CardBody>
  </Card>
</div>
