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

<div class="col-lg-5">
  <Card class="shadow-lg border-0 rounded-lg mt-5">
    <CardHeader>
      <h3 class="text-center font-weight-light my-4">Логин</h3>
    </CardHeader>
    <CardBody>
      <Form>
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
          <a class="small" href="pages/authentication/forget_password">
            Забыли пароль?
          </a>
          <Button color="primary" href=".">Вход</Button>
        </FormGroup>
      </Form>
    </CardBody>
    <CardFooter class="text-center small">
      <a href="pages/authentication/register">Нужен аккаунт? Зарегистрируйтесь!</a>
    </CardFooter>
  </Card>
</div>
