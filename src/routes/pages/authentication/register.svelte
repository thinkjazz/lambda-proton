<script>
  import Card from "sveltestrap/src/Card.svelte";
  import CardBody from "sveltestrap/src/CardBody.svelte";
  import CardHeader from "sveltestrap/src/CardHeader.svelte";
  import CardFooter from "sveltestrap/src/CardFooter.svelte";
  import Form from "sveltestrap/src/Form.svelte";
  import FormGroup from "sveltestrap/src/FormGroup.svelte";
  import Label from "sveltestrap/src/Label.svelte";
  import Input from "sveltestrap/src/Input.svelte";
  import Button from "sveltestrap/src/Button.svelte";
  import Row from "sveltestrap/src/Row.svelte";
  import Col from "sveltestrap/src/Col.svelte";
</script>

<Col class="col-lg-7">
  <Card class="shadow-lg border-0 rounded-lg mt-5">
    <CardHeader>
      <h3 class="text-center font-weight-light my-4">Создать аккаунт</h3>
    </CardHeader>
    <CardBody>
      <Form>
        <Row form>
          <div class="col-md-6">
            <FormGroup>
              <Label for="inputFirstName" class="small mb-1">Имя</Label>
              <Input
                class="py-4"
                type="text"
                name="firstName"
                id="inputFirstName"
                placeholder="Введите имя" />
            </FormGroup>
          </div>
          <div class="col-md-6">
            <FormGroup>
              <Label for="inputLastName" class="small mb-1">Фамилия</Label>
              <Input
                class="py-4"
                type="text"
                name="lastName"
                id="inputLastName"
                placeholder="Введите фамилию" />
            </FormGroup>
          </div>
        </Row>
        <FormGroup>
          <Label for="exampleEmail" class="small mb-1">Email</Label>
          <Input
            class="py-4"
            type="email"
            name="email"
            id="exampleEmail"
            placeholder="Введите адрес электронной почты" />
        </FormGroup>
        <Row form>
          <div class="col-md-6">
            <FormGroup>
              <Label for="inputPassword" class="small mb-1">Пароль</Label>
              <Input
                class="py-4"
                type="password"
                name="inputPassword"
                id="inputPassword"
                placeholder="Введите пароль" />
            </FormGroup>
          </div>
          <div class="col-md-6">
            <FormGroup>
              <Label for="inputConfirmPassword" class="small mb-1">
                Подтвердить пароль
              </Label>
              <Input
                class="py-4"
                type="password"
                name="inputConfirmPassword"
                id="inputConfirmPassword"
                placeholder="Подтвердить пароль" />
            </FormGroup>
          </div>
        </Row>
        <FormGroup class="mt-4 mb-0">
          <Button color="primary" block href="pages/authentication/login">
            Создать аккаунт
          </Button>
        </FormGroup>
      </Form>
    </CardBody>
    <CardFooter class="text-center small">
      <a href="pages/authentication/login">У вас есть аккаунт? Перейдите на страницу входа</a>
    </CardFooter>
  </Card>
</Col>
