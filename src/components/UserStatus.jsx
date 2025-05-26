export function UserStatus({status, name}){
    if(status){
        return(
            <div>
            <h1>Hej, {name}!</h1>
            </div>
        )
    
    } else{
        return(
            <div>
                <h1>Vänligen logga in</h1>
            </div>
        )
    }
}