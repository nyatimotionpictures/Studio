import Films from '../../components/Films';

function Admin() {
  return (
    <div className="w-full space-y-4">
      <div className="mt-4">
        <h2 className="text-lg uppercase font-bold">Admin Dashboard</h2>
        <p>
          This is an example of an admin page. You can add your admin
          functionalities here.
        </p>
      </div>
      <hr className="border border-gray-600 max-w-xl mx-auto" />
      <Films />
    </div>
  );
}

export default Admin;
