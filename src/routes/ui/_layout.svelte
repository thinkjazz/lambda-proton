<script>
  import Ui from "./ui.svelte";


  export let segment;
</script>

{#if segment === 'ui'}
  <Ui />
{/if}
