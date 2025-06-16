docker build -t ecommerce-ecr:latest .
docker tag ecommerce-ecr:latest 713881797197.dkr.ecr.us-east-1.amazonaws.com/ecommerce-ecr:latest
docker push 713881797197.dkr.ecr.us-east-1.amazonaws.com/ecommerce-ecr:latest
kubectl delete all --all
cd k8s/
kubectl apply -f .
kubectl get pods
