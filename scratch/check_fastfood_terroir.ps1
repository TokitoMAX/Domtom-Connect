$domains = @(
    'laboutiqueantillaise.com', 'domtomlivraison.com', 'colis-dom.com', 'dom-express.fr',
    'afro-cooking.com', 'neisson.com', 'troisrivieresrhum.com', 'reunion-boutique.com',
    'chocolaterie-thibaut.fr', 'distillerie-longueteau.com', 'bielle-rhum.com'
)

foreach ($d in $domains) {
    $res = Resolve-DnsName -Name $d -Type MX -ErrorAction SilentlyContinue
    if ($res) {
        Write-Host "$d : OK"
    } else {
        Write-Host "$d : NO_MX"
    }
}
