<script>

  import Row from "sveltestrap/src/Row.svelte";
  import Container from "sveltestrap/src/Container.svelte";

  export let segment;
</script>


{#if segment === 'ui'}

  <div>
      <main>
        <Container>
          <Row class="justify-content-center">
            <slot />
          </Row>
        </Container>
      </main>
  </div>
{:else}
  <body>
  <slot />
  </body>
{/if}
