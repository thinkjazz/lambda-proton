<script>
  import Table from "sveltestrap/src/Table.svelte";

  const tableHeading = ["#", "First name ", "Last name", "Username"];
  const tableData = [
    { SNo: "1", firstName: "PipBoy", lastName: "3000", userName: "@mdo" },
    { SNo: "2", firstName: "Gordon", lastName: "Freeman", userName: "@fat" },
    { SNo: "3", firstName: "Goulh", lastName: "Vaultboy13", userName: "@twitter" }
  ];
</script>

<Table bordered responsive>
  <thead>
    <tr>
      {#each tableHeading as heading}
        <th>{heading}</th>
      {/each}
    </tr>
  </thead>
  <tbody>

    {#each tableData as data}
      <tr>
        <th scope="row">{data.SNo}</th>
        <td>{data.firstName}</td>
        <td>{data.lastName}</td>
        <td>{data.userName}</td>
      </tr>
    {/each}
  </tbody>
</Table>
