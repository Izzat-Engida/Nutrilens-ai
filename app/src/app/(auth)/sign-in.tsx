import { View, Text,StyleSheet,TextInput,TouchableOpacity, KeyboardAvoidingView,Platform ,ScrollView} from 'react-native'
import React,{useState} from 'react'
import { Sparkles,Lock,Eye,EyeOff,Mail,ArrowRight } from "lucide-react-native";
import {useRouter} from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context";
const SignIN = () => {
  const router=useRouter()
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [showPassword, setShowPassword] = useState(false);

  const handleSignin=async ()=>{
    router.replace('/(onboarding)/Goals')
  }
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
       style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
<ScrollView
contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
>
      
       <View style={styles.brandRow}>
          <View style={styles.logoCircle}>
            <Sparkles size={20} color="#fff" />
          </View>
          <Text style={styles.brandText}>NutriLens AI</Text>
        </View>
        <View >
        <Text style={{fontSize:40,fontWeight:"bold"}}>Welcome back</Text>
        <Text style={{fontSize:18,color:"gray"}}>Sign in to continue your health journey</Text>
         <View style={{ marginTop: 30 }}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrapper}>
            <Mail size={18} color="gray" style={styles.icon} />
          <TextInput
            placeholder="test@example.com"
            onChangeText={setEmail}
            value={email}
            placeholderTextColor="gray"
            keyboardType='email-address'
            style={styles.input}
          />
          </View>

           <Text style={[styles.label, { marginTop: 20 }]}>PASSWORD</Text>
           <View style={styles.inputWrapper}>

          <Lock size={18} color="gray" style={styles.icon} />
          <TextInput
            placeholder="*******"
            onChangeText={setPassword}
            value={password}
            placeholderTextColor="gray"
             secureTextEntry={!showPassword}
              style={styles.input}
          />
           <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff size={18} color="gray" />
              ) : (
                <Eye size={18} color="gray" />
              )}
            </TouchableOpacity>
           </View>
            <TouchableOpacity style={{ alignSelf: "flex-end", marginTop: 10 }}>
            <Text style={{ color: "#0071E3", fontWeight: "600" }}>Forgot password?</Text>
          </TouchableOpacity>
          </View>
          <TouchableOpacity activeOpacity={0.8} onPress={handleSignin}>
        <View style={styles.signInButton}>
          <Text style={styles.signInText}>Sign in</Text>
          <ArrowRight size={22} color="white" style={{ marginLeft: 8 }} />
        </View>
</TouchableOpacity>
<View>
  <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
        <View style={styles.dividerLine} />
      </View>

       <TouchableOpacity activeOpacity={0.7}>
        <View style={styles.googleButton}>
          <Text style={styles.gLetter}>G</Text>
          <Text style={styles.googleText}>Continue with Google</Text>
        </View>
      </TouchableOpacity>
   <View style={styles.footerRow}>
        <Text style={styles.footerText}>New to NutriLens? </Text>
        <TouchableOpacity onPress={()=>{
          router.push('/(auth)/sign-up')
        }}>
          <Text style={styles.footerLink}>Create account</Text>
        </TouchableOpacity>
      </View>
</View>
    </View>
    </ScrollView>
     </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default SignIN

const styles=StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 50,
  },
  logoCircle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "#0071E3",
    justifyContent: "center",
    alignItems: "center",
  },
  brandText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#444",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 55,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  icon: {
    marginRight: 10,
  },
  input:{
    flex:1,
    fontSize:16,
    color:"#000",
  },
  signInButton: {
  backgroundColor: "#0071E3",
  paddingVertical: 16,
  borderRadius: 50,
  marginTop: 20,
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row",
  shadowColor: "#0071E3",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.3,
  shadowRadius: 10,
  elevation: 6,
},
signInText: {
  color: "white",
  fontSize: 18,
  fontWeight: "700",
},
 dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0e0e0",
  },
   dividerText: {
    marginHorizontal: 10,
    fontSize: 12,
    fontWeight: "600",
    color: "gray",
    letterSpacing: 0.5,
  },
   googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 50,
    paddingVertical: 16,
  },
  gLetter: {
    fontSize:18,
    fontWeight:"bold",
    color:"#EA4335",
    marginRight:10,
  },
   googleText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
   footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 15,
    color: "gray",
  },
  footerLink: {
    fontSize: 15,
    color: "#0071E3",
    fontWeight: "700",
  },
})