<script>
  export let src = "logo-192.png";
  export let alt = "logo";

  let className = "logo";
  export { className as class };
</script>

<img class="img-fluid {className}" {src} {alt} />
