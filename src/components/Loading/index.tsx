import { ActivityIndicator, View } from "react-native";
import { Wrapper } from "./style";

function Loading() {
  return (
    <Wrapper>
      <ActivityIndicator color="#5EEAD4" size={30}/>
    </Wrapper>
  )
}

export default Loading;