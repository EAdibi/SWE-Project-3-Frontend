import { ScrollView } from 'react-native';
import SignUp from '../components/SIgnUp/signUp';

export default function Page() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
      <SignUp />
    </ScrollView>
  );
}  
