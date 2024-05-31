window.addEventListener('load',()=>{
    const form = document.querySelector('#form_main');
    const inputElA = form.children.inputA;
    const inputElB = form.children.inputB;

    form.addEventListener('submit', e=>{
        e.preventDefault();
        // console.debug('onSubmit', e);
        try {
            const formData = new FormData(e.target);
            const data = Array.from(formData.entries()).reduce((obj, pair)=>{obj[pair[0]] = pair[1]; return obj}, {});
            const { inputA, inputB } = data;

            const {items: itemsA} = parseMask(inputA);
            const {header: headerB, items: itemsB} = parseMask(inputB);

            const resultItems = combineMasks(itemsA, itemsB);

            inputElB.value = stringifyMask(headerB, resultItems);
            inputElA.value = "Items from this mask combined into mask B";

            console.debug(headerB, resultItems);
        } catch (error) {
            console.error(error);
            inputElB.value = error;
        }
        
        return false;
    });

    inputElA.ondrop = onDropFile;
    inputElB.ondrop = onDropFile;
    inputElA.ondragover = preventDefault;
    inputElB.ondragover = preventDefault;

    function preventDefault(e){
        e.preventDefault() 
    }

    function onDropFile(e){
        // console.debug('onDrop', e);
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        dropFile(file).then(res=>{
            e.target.value = res;
        }).catch(e=>{
            e.target.value = e;
        })
    }

    function dropFile(file) {
        return new Promise((resolve, reject)=>{
            const reader = new FileReader();
            reader.onload = e=> {
                resolve(e.target.result);
            };
            reader.onerror = e=> {
                reject(e);
            };
            reader.readAsText(file, "UTF-8");
        });
    }

    function combineMasks(itemsA, itemsB){
        const allPaths = new Set([...Object.keys(itemsA), ...Object.keys(itemsB)]);
        const result = {};
        for(let path of allPaths){
            const weight = parseInt(itemsA[path]) || parseInt(itemsB[path]) || 0;
            result[path] = (weight + '');
        }
        return result;
    }

    function stringifyMask(header, items){
        return header + '\n' + Object.keys(items).filter(key=>items.hasOwnProperty(key)).sort().reduce((str,key)=>{
            return `${str}  - m_Path: ${key}    m_Weight: ${items[key]}\n`;
        },'');
    }

    function parseMask(str){
        const headerWithout = str.split(/^%YAML[\w\W]+m_Elements:/)[1];
        const headerEndIndex = str.length - (headerWithout && headerWithout.length);
        if(!headerWithout || headerEndIndex <= 0) throw new Error('YAML header not found, is the input a mask?');
        const header = str.substring(0, headerEndIndex);
        const itemsBody = str.substring(headerEndIndex, str.length);
        const itemsStrings = itemsBody.match((/(?:\s{2}-\sm_Path:\s)([\w\W]+?)(?:\s{4}m_Weight:\s)(\d)/gm));

        const empty = (!itemsStrings && (/\s*\[\]\s*/).test(itemsBody));

        const items = empty? {} : itemsStrings.reduce((obj,item)=>{
            const parts = (/(?:\s{2}-\sm_Path:\s)([\w\W]+?)(?:\s{4}m_Weight:\s)(\d)/gm).exec(item);
            if(!parts){
                throw new Error(`regex failed to match item "${item}"`);
            }
            const path = parts[1];
            const weight = parts[2];
            obj[path] = weight;
            return obj;
        },{});

        return {header, items};
    }
})