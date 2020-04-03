<script>
  // import ui from "./ui.svelte";
  import Row from "sveltestrap/src/Row.svelte";
  import Container from "sveltestrap/src/Container.svelte";
  export let segment;
</script>


{#if segment === 'ui'}

  <div id="layoutAuthentication" class="l-proton-dark-bg ">
    <div id="layoutAuthentication_content">
      <main>
        <Container>
          <Row class="justify-content-center">
            <slot />
          </Row>
        </Container>
      </main>
    </div>
  </div>
{:else}
  <div id="layoutAuthentication" class="l-proton-dark-bg ">
    <div id="layoutAuthentication_content">
      <main>
        <Container>
          <Row class="justify-content-center">
            <slot />
          </Row>
        </Container>
      </main>
    </div>
  </div>
  <div id="layoutError">
    <div id="layoutError_content">
      <main>
        <Container>
          <div class="row justify-content-center">
            <div class="col-lg-6">
              <div class="text-center mt-4">
                <slot />
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  </div>
{/if}