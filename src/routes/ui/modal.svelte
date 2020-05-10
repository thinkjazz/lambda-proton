<script>
    import  Breadcrumb  from "sveltestrap/src/Breadcrumb.svelte";
    import  BreadcrumbItem  from "sveltestrap/src/BreadcrumbItem.svelte";
    import  Row  from "sveltestrap/src/Row.svelte";
    import  Button from "sveltestrap/src/Button.svelte";
    import  ButtonGroup from "sveltestrap/src/ButtonGroup.svelte";
    import  Modal from "sveltestrap/src/Modal.svelte";
    import  ModalBody from "sveltestrap/src/ModalBody.svelte";
    import  ModalFooter from "sveltestrap/src/ModalFooter.svelte";
    import  ModalHeader from "sveltestrap/src/ModalHeader.svelte";
    let open = false;
    const toggle = () => (open = !open);

    let openSizeModal = false;
    let size;
    const toggleSt = () => {
        size = undefined;
        openSizeModal = !openSizeModal;
    };
    const toggleLg = () => {
        size = "lg";
        openSizeModal = !openSizeModal;
    };
    const toggleSm = () => {
        size = "sm";
        openSizeModal = !openSizeModal;
    };


    let title = "Modals | UI";
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>
<h1 class="mt-4">Modals</h1>
<Breadcrumb class="mb-4">
    <BreadcrumbItem active>Modals</BreadcrumbItem>
</Breadcrumb>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Modals</h2>
        <div>
            <p>
                Use the JavaScript plugin \ Svelte to add dialogs for lightboxes,
                user notifications or all user content.
            </p>
            <Button color="danger" on:click={toggle}>
                Open modal window
            </Button>

            <Modal isOpen={open} {toggle}>
                <ModalHeader {toggle}>Title</ModalHeader>
                <ModalBody>
                    Whoo, you're reading this text in a modal way!
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" on:click={toggle}>
                      Ok
                    </Button>
                    <Button color="secondary" on:click={toggle}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    </div>
</Row>

<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Modals: Sizes</h2>
        <div>
            <ButtonGroup>
                <Button color="success" on:click={toggleSm}>
                   Small modal
                </Button>
                <Button color="warning" on:click={toggleSt}>
                    Standard modal
                </Button>
                <Button color="danger" on:click={toggleLg}>
                    Large modal
                </Button>
            </ButtonGroup>

            <Modal isOpen={openSizeModal} {toggleSt} {size}>
                <ModalHeader {toggleSt}>Title</ModalHeader>
                <ModalBody>
                    Whoo, you're reading this text in a modal way!
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" on:click={toggleSt}>
                        Ok
                    </Button>
                    <Button color="secondary" on:click={toggleSt}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    </div>
</Row>
