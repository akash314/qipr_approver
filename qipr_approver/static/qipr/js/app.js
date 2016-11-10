
//this automatically executes
! function () {

    window.Toaster = function () {
        var timeToShow = 500,
            timeToHide = 5000,
            Toaster = function () {
                var self = this;
                this.toast = document.getElementById('toast') || undefined;

                this.show = () => {
                    window.setTimeout(function () {
                        if (self.toast) {
                            self.toast.classList.add('cts-toast--active');
                        }
                    }, timeToShow);
                };

                this.hide = () => {
                    window.setTimeout(function () {
                        if (self.toast) {
                            self.toast.classList.remove('cts-toast--active');
                        }
                    }, timeToHide);
                };

                this.flash = () => {
                    this.show();
                    this.hide();
                };
            };

        return new Toaster();
    }();

    window.Toaster.flash();

//////////////
//end toast
//////////////

    $(document).on("keypress", ":input:not(textarea)", function(event) {
        return event.keyCode != 13;
    });

    tagboxInputs = document.getElementsByClassName("tagbox__input");

    Array.prototype.forEach.call(tagboxInputs, (node) => {
        node.addEventListener("keyup", function(event) {
            event.preventDefault();
            if (event.keyCode == 13) {
                addTag(this);
            }
        });
        node.addEventListener("blur", function(event) {
            event.preventDefault();
            addTag(this);
        });
        node.addEventListener("input", function(event) {
            var invisibleSpace = '\u200B';
            if (event.target.value.includes(invisibleSpace)){
                addTag(this);
            }
            return true;
        });
    });

    getTagboxName = function (node) {
        if (node.parentElement) {
            if (node.hasAttribute('data-name')) {
                return node.getAttribute('data-name');
            } else {
                return getTagboxName(node.parentElement);
            }
        }
    };

    addTag = function(inputNode) {
        var text = inputNode.value.trim(),
            name = getTagboxName(inputNode),
            tagHolderId = 'tag-holder_' + name,
            key;

        if (text) {
            if (addValue(name, text)){
                tag = createtag(text);
                document.getElementById(tagHolderId).appendChild(tag);
                inputNode.value = "";
            }
        }
    };

    tagAlreadyExists = function(valuesArray,val) {
        return (valuesArray.map(removeInvisibleSpace).indexOf(removeInvisibleSpace(val)) != -1);
    };

    removeInvisibleSpace = function(inputString){
        return inputString.replace('\u200B', '');
    };

    createtag = function(text) {
        var container = document.createElement('div'),
            li = document.createElement('li'),
            tagDelete = document.createElement('i'),
            icontext = document.createTextNode('cancel'),
            tagtext = document.createTextNode(text);

        container.appendChild(li);
        container.appendChild(tagDelete);
        li.appendChild(tagtext);
        tagDelete.appendChild(icontext);

        li.classList.add('tag');
        tagDelete.classList.add('tiny');
        tagDelete.classList.add('tag__delete');
        container.classList.add('tag__container');

        tagDelete.addEventListener('click', function(event) {
            event.preventDefault();
            deleteTag(event);
        });

        return container;
    };

    addValue = function (name, val) {
        var hiddenInputNode = document.getElementById('tag-input_' + name),
            values = hiddenInputNode.value.split(';');
        if (!tagAlreadyExists(values,val)){
            values.push(val);
            hiddenInputNode.value = values.join(';');
            return true;
        }
        return false;
    };

    deleteTag = function (event) {
        var removeMe = event.target.parentElement,
            value = event.target.parentElement.children[0].textContent,//the li
            parent = removeMe.parentElement;
        removeValue(getTagboxName(event.target), value);
        parent.removeChild(removeMe);
    };

    removeValue = function (name, val) {
        var hiddenInputNode = document.getElementById('tag-input_' + name),
            values = hiddenInputNode.value.split(';');
        values = values.filter((item) => item !== val);
        hiddenInputNode.value = values.join(';');
    };

    delete_tags = document.getElementsByClassName("tag__delete");

    Array.prototype.forEach.call(delete_tags, (node) => {
        node.addEventListener('click', deleteTag);
    });

    $('.datepicker').pickadate({
        formatSubmit: 'yyyy-mm-dd',
        hiddenName: true,
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year
    });

    $('.modal-trigger').leanModal();

    window.submit_answer = function (questionId, projectId, choiceId) {
        window.$.ajax('/answer_submit/', {
            method: 'POST',
            data: {
                choice_id: choiceId,
                project_id: projectId,
                question_id: questionId,
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
            }
        });
    };

    // if the other option in self classification on the about you form is selected,
    // show a new text box for the customer to write in the other classification
    self_classification = document.getElementById('select-self_classification');
    if(self_classification){
        self_classification.onchange = function(){
            if (this.options[this.selectedIndex].value == "other") {
                //shrink clinical area
                clinical_area = document.getElementById('tagbox_clinical_area');
                other_classification_input = document.getElementById('self_classification_other_div');
                clinical_area.parentElement.classList.remove('m6');
                clinical_area.parentElement.classList.add('m3');
                //shrink self classification
                this.parentElement.parentElement.classList.remove('m6');
                this.parentElement.parentElement.classList.add('m3');
                //make the other field show
                other_classification_input.style.display = 'block';
            } else {
                //enlarge clinical area
                clinical_area = document.getElementById('tagbox_clinical_area');
                other_classification_input = document.getElementById('self_classification_other_div');
                clinical_area.parentElement.classList.remove('m3');
                clinical_area.parentElement.classList.add('m6');
                //enlarge self classification
                this.parentElement.parentElement.classList.remove('m3');
                this.parentElement.parentElement.classList.add('m6');
                //make the other field disappear 
                other_classification_input.style.display = 'none';
            }
        };
    };
}();
