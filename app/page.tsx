import Auth from './components/auth';
import MessageForm from './components/message-form';

const Home = async () => {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cepheus</h1>
      <Auth />
      <MessageForm />
    </main>
  );
};

export default Home;
