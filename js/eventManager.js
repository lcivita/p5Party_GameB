function subscribePartyEvents()
{
    if (partyIsHost())
    {
        partySubscribe("filePosUpdate", updateSharedFilePos);
    } 
}