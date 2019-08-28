function removeDuplicate(arr, comp) {
    const values = arr.map(e => e[comp])

        // store the keys of the unique objects
    const x = values.map((e, i, final) => final.indexOf(e) === i && i)

        // eliminate the dead keys & store unique objects
    const y = x.filter(e => arr[e]).map(e => arr[e]);

    return y;
}

module.exports = { removeDuplicate }