<script>
  import Card from "sveltestrap/src/Card.svelte";
  import CardBody from "sveltestrap/src/CardBody.svelte";
  import CardHeader from "sveltestrap/src/CardHeader.svelte";
  import CardFooter from "sveltestrap/src/CardFooter.svelte";
  import Form from "sveltestrap/src/Form.svelte";
  import FormGroup from "sveltestrap/src/FormGroup.svelte";
  import Label from "sveltestrap/src/Label.svelte";
  import Input from "sveltestrap/src/Input.svelte";
  import Col from "sveltestrap/src/Col.svelte";
  import Button from "sveltestrap/src/Button.svelte";
</script>

<div class="col-lg-5">
  <Card class="shadow-lg border-0 rounded-lg mt-5">
    <CardHeader>
      <h3 class="text-center font-weight-light my-4">Восстановление пароля</h3>
    </CardHeader>
    <CardBody>
      <div class="small mb-3 text-muted">
        Введите ваш адрес электронной почты, и мы вышлем вам ссылку для перезагрузки вашего
        пароль.
      </div>
      <Form>
        <FormGroup>
          <Label for="inputEmailAddress" class="small mb-1">Email</Label>
          <Input
            class="py-4"
            type="email"
            name="inputEmailAddress"
            id="inputEmailAddress"
            placeholder="Введите почту" />
        </FormGroup>
        <FormGroup
          class="d-flex align-items-center justify-content-between mt-4 mb-0">
          <a class="small" href="pages/authentication/login">Вернуться к входу в систему</a>
          <Button color="primary" href="pages/authentication/login">
            Сброс пароля
          </Button>
        </FormGroup>
      </Form>
    </CardBody>
    <CardFooter class="text-center small">
      <a href="pages/authentication/register">Нужен аккаунт? Зарегистрируйтесь!</a>
    </CardFooter>
  </Card>
</div>
