```ts
//sdk

//new PC pin verify
import { pinVerify } from "us-sdk";
export const interface inputParams {
next: string; // next url
return_url: string;
nonce: string;
origin: string; // target url pinVerify page will postMessage
extraData: JSON String; //some params from caller side to pinVerify Page
}
//sdk will return result 
const result = await pinVerify(params:inputParams);
```

## pc-create-pin wallet

```mermaid
sequenceDiagram
autonumber
participant A  as user
participant B  as wallet Page(shopeepay)
participant D  as Create-Pin Modal(paymentPasscode)
participant F  as addPhone Modal
participant E  as OTP Service Modal
participant C  as seller BE
A->>B: user  enter wallet
B->>C: await paymentService.wallet.isPasscodeSet('/finance/has_wallet_password')
C-->>B: get response
alt hasPassword
B-->>A: user can enter shopeepay wallet balance Page
else
B->>D: PaymentPasscode.modal({createPaymentPasscode: true})
alt has no phoneNumber
D->>F: user add phone
end
B->>E: show OTP Modal
E->>C: request OTP
C-->>E: get response
E-->>E: input OTP
E-->D: return createPin Modal with OTP
D-->>D: input pin and confirm pin
D->>C: await createPin('finance/set_wallet_password')
C-->D: get response
alt Success
D-->>D: show success UI
else
D-->>D: show error UI
end
D-->>B: return to wallet Page
end
B-->>A: user pop from wallet Page
```

pc-create (paymentSetting)

```mermaid
sequenceDiagram
autonumber
participant A  as user
participant B  as walletPin PaymentSetting Page
participant E  as Update-Pin Modal
participant F  as OTP Modal
participant G  as addPhoneModal
participant C  as seller BE
A->>B: user with hasPin enter walletPin Setting page
B->>C:  await changePaymentPasswordPreCheck() check whether new Device coolDown logic
C-->>B: get response
B ->> E: user click update button to update walletPin
E ->> E: user input new wallet pin and confirm pin click next
alt has nophoneNumber
E ->> G: user navigate to addPhoneModal
else
end
E ->> F: user navigate to OTP Modal （seller base common OTP service）
F ->> C: OTP request('api/seller_components/otp/send_by_token')
C -->> F: user get OTP
F ->> F: user input OTP
F-->>E: user quit OTP flow
E ->>C:  await updatePin('finance/set_wallet_password')
C-->> E: user get response(success or fail)
E-->>B: user return walletPin Setting
B-->> A: user quit walletPin Setting
```

create Pin PinSetting (PC seller version)

```mermaid
sequenceDiagram
autonumber
participant A  as user
participant B  as walletPin PaymentSetting Page
participant D  as Create-Pin Modal
participant F  as OTP Modal
participant G  as addPhoneModal
participant C  as seller BE
A->>B: user with has no Pin enter walletPin Setting page
B ->> D: user click create button to create walletPin
D ->> D: user input and confirm new wallet pin
alt has nophoneNumber
D ->> G: user navigate to addPhoneModal
else
end
D ->> F: user navigate to OTP Modal （seller base common OTP service）
F ->> C:  OTP request('api/seller_components/otp/send_by_token')
C -->> F: user get OTP
F ->> F: user input OTP
F-->>D: user quit OTP flow
D ->>C: createPin('finance/set_wallet_password')
C-->>D: user get response(success or fail)
D-->>B: user return walletPin Setting
B-->> A: user quit walletPin Setting
```

## new createPin/UpdatePin

```mermaid
 sequenceDiagram
	autonumber
	participant A as Entry
	participant B as create/update pin page
  participant D as OTP Modal
  participant E as addPhone Modal
	participant C as US BE
		A ->> +B: createPin()/updatePin() //us-sdk
	alt is url has nonce?
		B ->> +C: auth_api?next_url=[pp_page?next=result_page]&nonce
		alt exchange success
			C -->> -B: be write cookie and 302 to redirect_url next_url: pp_page?next=result_page&[auth_error]=xxx
		else fail
			B -->> B: deal with auth_error
		end
	end
  Note over A,C: create/update Pin
	alt is account normal
   alt have not SetPin
		B -->> B: show createPin UI and input pin
    alt has noPhoneNumber
    B->>E: show addPhone Modal
    E-->>E: input phone number
    E-->>B: quit addPhone Modal
    B->>D: show OTP Modal
    D->>C: send OTP request
    C-->>D: get OTP
    D-->>D: input OTP
    D-->>B: quit OTP modal
    end
  else  have setPin
   	B -->> B: show updatePin UI and input pin
  end
    B->>D: show OTP Modal
    D->>C: send OTP request
    C-->>D: get OTP
    D-->>D: input OTP
    D-->>B: quit OTP modal
		B ->> +C: set pin
		C -->> -B: response result
		alt set pin success?
      		B -->> A: auth_code=xxx(PostMessage)
    else set pin fail?
      		B -->> B: show error UI
 		end
    		B -->> A: error_code=xxx
     end

```

## new pin verify

```mermaid
 sequenceDiagram
	autonumber
	participant A as Entry
	participant B as PinVerify page
	participant C as US BE
  participant D as create/update pin
		A ->> +B: navigateNewPinVerifyFlow()//us-sdk
	alt has nonce?
		B ->> +C: auth_api?next_url=[pp_page?next=result_page]&nonce
		alt exchange success
			C -->> -B: be write cookie and 302 to redirect_url next_url: pp_page?next=result_page&[auth_error]=xxx
		else fail
			B -->> B: deal with auth_error
		end
	end
	alt is account normal
		B -->> B: show verify pin UI and input pp
    alt forget pin ?
    B->>D: navigate to update pin
    end
		B ->> +C: verify pin
		C -->> -B: response result
		alt verify success?
      			B -->> A: auth_code=xxx(PostMessage)
    else verify fail?
      		B -->> B: show error UI
 		end
    		B -->> A: error_code=xxx
     end
```

## pc-pin-verify

```mermaid
sequenceDiagram
autonumber
participant A  as user
participant B as withDraw Page
participant C  as seller  BE
participant D as pin verify Modal
participant E as payment Setting Page
participant F as addPhoneModal
participant G as OTPModal

A->>B: user enter withdraw page
B->>D:  PaymentPasscode.modal({createPaymentPasscode: false})
alt haveforgotpin
alt isCBUser
D->>E: navigate to paymentSetting Page
else
alt has no PhoneNumber
D->>F: user add phone
else
end
D->>G: user request OTP
end
else
D-->>D: input pin
D->>C:  await verifyPin('/finance/verify_payment_pass/') 
C-->>D: get response 
alt success
D-->>D: show success UI
else
D-->>D: show error UI
end 
D-->>B: return Hashpin
B->> C: await withdrawals({xxxx,pin });
C-->>B: get response
end
B-->>A: user quit withDraw flow
```

现在只有 paymentSetting 一个更改密码的地方，没有 basic Setting
