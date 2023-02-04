import { ActivityIndicator, View } from "react-native";
import { Wrapper } from "./style";

function Loading() {
  return (
    <Wrapper>
      <ActivityIndicator color="#7C3AED" />
    </Wrapper>
  )
}

export default Loading;