$domains = @('wax-corner.com', 'afrowax.fr', 'bijoux-creoles.com', 'totem-mode.com')
foreach ($d in $domains) {
    $res = Resolve-DnsName -Name $d -Type MX -ErrorAction SilentlyContinue
    if ($res) {
        Write-Host "$d : OK"
    } else {
        Write-Host "$d : NO_MX"
    }
}
